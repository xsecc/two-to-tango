import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('remove', () => {
    const eventId = 'test-event-id';
    const userId = 'test-user-id';
    const otherUserId = 'other-user-id';

    it('should successfully delete an event when user is the creator', async () => {
      // Arrange
      const mockEvent = { creatorId: userId };
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrismaService);
      });
      mockPrismaService.event.update.mockResolvedValue({});
      mockPrismaService.event.delete.mockResolvedValue({});

      // Act
      await service.remove(eventId, userId);

      // Assert
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
        select: { creatorId: true },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.event.update).toHaveBeenCalledWith({
        where: { id: eventId },
        data: {
          tags: {
            set: [],
          },
        },
      });
      expect(mockPrismaService.event.delete).toHaveBeenCalledWith({
        where: { id: eventId },
      });
    });

    it('should throw NotFoundException when event does not exist', async () => {
      // Arrange
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(eventId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
        select: { creatorId: true },
      });
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      // Arrange
      const mockEvent = { creatorId: otherUserId };
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      // Act & Assert
      await expect(service.remove(eventId, userId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
        select: { creatorId: true },
      });
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should handle database errors during transaction', async () => {
      // Arrange
      const mockEvent = { creatorId: userId };
      const dbError = new Error('Database connection failed');
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.$transaction.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.remove(eventId, userId)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaService.event.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });
});
