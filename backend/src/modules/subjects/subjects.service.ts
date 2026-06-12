import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from '../../database/schemas/subject.schema';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>) {}

  async create(data: Partial<Subject>) {
    const existing = await this.subjectModel.findOne({
      code: data.code?.toUpperCase(),
      school: data.school,
      grade: data.grade,
    });
    if (existing) throw new ConflictException('Subject with this code already exists for this grade');
    return this.subjectModel.create({ ...data, code: data.code?.toUpperCase() });
  }

  async findAll(query: { page?: number; limit?: number; school?: string; grade?: string; category?: string }) {
    const { page = 1, limit = 50, school, grade, category } = query;
    const filter: Record<string, unknown> = { isActive: true };
    if (school) filter.school = new Types.ObjectId(school);
    if (grade) filter.grade = grade;
    if (category) filter.category = category;

    const [subjects, total] = await Promise.all([
      this.subjectModel
        .find(filter)
        .populate('teacher', 'user')
        .populate('school', 'name code')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ grade: 1, name: 1 }),
      this.subjectModel.countDocuments(filter),
    ]);

    return { subjects, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const subject = await this.subjectModel.findById(id).populate('teacher').populate('school', 'name code');
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: string, updates: Partial<Subject>) {
    const subject = await this.subjectModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }
}
