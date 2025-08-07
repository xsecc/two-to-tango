import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req,
  ): Promise<EventResponseDto> {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  async findAll(): Promise<EventResponseDto[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ): Promise<EventResponseDto> {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rsvp')
  async rsvp(@Param('id') id: string, @Request() req) {
    return this.eventsService.rsvp(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/rsvp')
  async cancelRsvp(@Param('id') id: string, @Request() req) {
    return this.eventsService.rsvp(id, req.user.id);
  }

  @Get(':id/suggested-attendees')
  async getSuggestedAttendees(@Param('id') id: string) {
    return this.eventsService.getSuggestedAttendees(id);
  }
}
