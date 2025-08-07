import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto, InterestResponseDto } from './dto/interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createInterestDto: CreateInterestDto,
  ): Promise<InterestResponseDto> {
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  async findAll(): Promise<InterestResponseDto[]> {
    return this.interestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InterestResponseDto> {
    return this.interestsService.findOne(id);
  }
}
