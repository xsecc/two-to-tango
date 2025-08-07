import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto, InterestResponseDto } from './dto/interest.dto';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

@Injectable()
export class InterestsService {
  private purify;

  constructor(private prisma: PrismaService) {
    // Configurar DOMPurify para Node.js
    const window = new JSDOM('').window;
    this.purify = DOMPurify(window as any);
  }

  async create(createInterestDto: CreateInterestDto): Promise<InterestResponseDto> {
    const { name } = createInterestDto;

    // Sanitizar el nombre adicional
    const sanitizedName = this.purify.sanitize(name, { ALLOWED_TAGS: [] });

    // Check if interest already exists
    const interestExists = await this.prisma.interest.findUnique({
      where: { name: sanitizedName },
    });

    if (interestExists) {
      throw new ConflictException('Interest already exists');
    }

    // Create interest
    const interest = await this.prisma.interest.create({
      data: { name: sanitizedName },
    });

    return interest;
  }

  async findAll(): Promise<InterestResponseDto[]> {
    const interests = await this.prisma.interest.findMany();
    
    // Sanitizar los nombres al devolverlos
    return interests.map(interest => ({
      ...interest,
      name: this.purify.sanitize(interest.name, { ALLOWED_TAGS: [] })
    }));
  }

  async findOne(id: string): Promise<InterestResponseDto> {
    const interest = await this.prisma.interest.findUnique({
      where: { id },
    });

    if (!interest) {
      throw new NotFoundException('Interest not found');
    }

    return {
      ...interest,
      name: this.purify.sanitize(interest.name, { ALLOWED_TAGS: [] })
    };
  }
}
