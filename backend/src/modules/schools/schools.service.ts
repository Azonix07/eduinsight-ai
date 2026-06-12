import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from '../../database/schemas/school.schema';
import { escapeRegex } from '../../common/utils/security.util';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);

  constructor(@InjectModel(School.name) private schoolModel: Model<SchoolDocument>) {}

  async create(data: Partial<School>) {
    const existing = await this.schoolModel.findOne({ code: data.code?.toUpperCase() });
    if (existing) throw new ConflictException('School with this code already exists');
    return this.schoolModel.create({ ...data, code: data.code?.toUpperCase() });
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = query;
    const filter: Record<string, unknown> = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: 'i' } },
        { code: { $regex: escapeRegex(search), $options: 'i' } },
      ];
    }

    const [schools, total] = await Promise.all([
      this.schoolModel.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      this.schoolModel.countDocuments(filter),
    ]);
    return { schools, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const school = await this.schoolModel.findById(id);
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, updates: Partial<School>) {
    const school = await this.schoolModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async deactivate(id: string) {
    await this.schoolModel.findByIdAndUpdate(id, { isActive: false });
    return { message: 'School deactivated' };
  }
}
