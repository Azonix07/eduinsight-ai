import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from '../../database/schemas/student.schema';
import { escapeRegex } from '../../common/utils/security.util';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async create(data: Partial<Student>) {
    return this.studentModel.create(data);
  }

  async findAll(query: {
    page?: number; limit?: number; school?: string; grade?: string; section?: string; search?: string;
  }) {
    const { page = 1, limit = 20, school, grade, section, search } = query;
    const filter: Record<string, unknown> = { isActive: true };
    if (school) filter.school = new Types.ObjectId(school);
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (search) {
      filter.$or = [
        { rollNumber: { $regex: escapeRegex(search), $options: 'i' } },
        { admissionNumber: { $regex: escapeRegex(search), $options: 'i' } },
      ];
    }

    const [students, total] = await Promise.all([
      this.studentModel
        .find(filter)
        .populate('user', 'firstName lastName email avatar')
        .populate('school', 'name code')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ grade: 1, section: 1, rollNumber: 1 }),
      this.studentModel.countDocuments(filter),
    ]);

    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const student = await this.studentModel
      .findById(id)
      .populate('user', 'firstName lastName email avatar')
      .populate('school', 'name code');
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findByUser(userId: string) {
    return this.studentModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('user', 'firstName lastName email avatar')
      .populate('school', 'name code');
  }

  async update(id: string, updates: Partial<Student>) {
    const student = await this.studentModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async getBySchoolGradeSection(school: string, grade: string, section: string) {
    return this.studentModel
      .find({ school: new Types.ObjectId(school), grade, section, isActive: true })
      .populate('user', 'firstName lastName email avatar')
      .sort({ rollNumber: 1 });
  }
}
