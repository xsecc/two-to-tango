import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<EventResponseDto> {
    const { title, description, date, location, tags } = createEventDto;

    // Create event
    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        creator: {
          connect: { id: userId },
        },
        tags: tags
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            interests: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    return event as EventResponseDto;
  }

  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            interests: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tags: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transformar los datos para el frontend
    const transformedEvents = events.map(event => ({
      ...event,
      organizerId: event.creatorId,
      organizer: {
        ...event.creator,
        interests: (event.creator as any).interests?.map((interest: any) => interest.id) || [],
      },
      attendees: event.rsvps.map(rsvp => rsvp.user),
    }));

    return transformedEvents as EventResponseDto[];
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                interests: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Transformar los datos para el frontend
    const transformedEvent = {
      ...event,
      organizerId: event.creatorId,
      organizer: {
        ...event.creator,
        interests: (event.creator as any).interests?.map((interest: any) => interest.id) || [],
      },
      attendees: event.rsvps.map(rsvp => rsvp.user),
    };

    return transformedEvent as EventResponseDto;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<EventResponseDto> {
    // Check if event exists and user is the creator
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You are not the creator of this event');
    }

    const { title, description, date, location, tags } = updateEventDto;

    // Update event
    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    return updatedEvent as EventResponseDto;
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      // Check if event exists and user is the creator
      const event = await this.prisma.event.findUnique({
        where: { id },
        select: { creatorId: true },
      });
  
      if (!event) {
        throw new NotFoundException('Event not found');
      }
  
      if (event.creatorId !== userId) {
        throw new ForbiddenException('You are not the creator of this event');
      }
  
      // Use a transaction to ensure all related data is deleted properly
      await this.prisma.$transaction(async (prisma) => {
        // First, disconnect all tags from the event
        await prisma.event.update({
          where: { id },
          data: {
            tags: {
              set: [], // This disconnects all tags
            },
          },
        });
  
        // Then delete the event (RSVPs will be deleted automatically due to cascade)
        await prisma.event.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      // Log the error for debugging
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event. Please try again.');
    }
  }

  async rsvp(eventId: string, userId: string): Promise<void> {
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user already RSVP'd
    const existingRsvp = await this.prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingRsvp) {
      // If already RSVP'd, remove the RSVP (toggle)
      await this.prisma.rSVP.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });
    } else {
      // Create RSVP
      await this.prisma.rSVP.create({
        data: {
          user: {
            connect: { id: userId },
          },
          event: {
            connect: { id: eventId },
          },
        },
      });
    }
  }

  async getSuggestedAttendees(eventId: string): Promise<any[]> {
    // Get event with its tags
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tags: true,
        rsvps: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Get users with similar interests who haven't RSVP'd yet
    const rsvpUserIds = event.rsvps.map((rsvp) => rsvp.userId);

    // Find users with matching interests
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: rsvpUserIds,
        },
        interests: {
          some: {
            name: {
              in: event.tags.map((tag) => tag.name),
            },
          },
        },
      },
      include: {
        interests: true,
      },
      take: 10, // Limit to 10 suggestions
    });

    // Remove passwords from response
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
