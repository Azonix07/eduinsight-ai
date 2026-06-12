import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from '../../database/schemas/teacher.schema';

@Injectable()
export class TeachersService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>) {}

  async create(data: Partial<Teacher>) {
    return this.teacherModel.create(data);
  }

  async findAll(query: { page?: number; limit?: number; school?: string; department?: string }) {
    const { page = 1, limit = 20, school, department } = query;
    const filter: Record<string, unknown> = { isActive: true };
    if (school) filter.school = new Types.ObjectId(school);
    if (department) filter.department = department;

    const [teachers, total] = await Promise.all([
      this.teacherModel
        .find(filter)
        .populate('user', 'firstName lastName email avatar')
        .populate('school', 'name code')
        .populate('subjects', 'name code')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.teacherModel.countDocuments(filter),
    ]);

    return { teachers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('user', 'firstName lastName email avatar')
      .populate('school', 'name code')
      .populate('subjects', 'name code');
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async findByUser(userId: string) {
    return this.teacherModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('user', 'firstName lastName email avatar')
      .populate('subjects', 'name code');
  }

  async update(id: string, updates: Partial<Teacher>) {
    const teacher = await this.teacherModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }
}
