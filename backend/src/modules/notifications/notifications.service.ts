import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationModel, NotificationDocument } from '../../database/schemas/notification.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(NotificationModel.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: { user: string; type: string; title: string; message: string; data?: Record<string, unknown> }) {
    return this.notificationModel.create({
      ...data,
      user: new Types.ObjectId(data.user),
    });
  }

  async findByUser(userId: string, query: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const { page = 1, limit = 20, unreadOnly } = query;
    const filter: Record<string, unknown> = { user: new Types.ObjectId(userId) };
    if (unreadOnly) filter.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.notificationModel.countDocuments(filter),
      this.notificationModel.countDocuments({ user: new Types.ObjectId(userId), isRead: false }),
    ]);

    return { notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id: string, userId: string) {
    // Scoped to the requesting user — prevents marking someone else's notification.
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, user: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true },
    );
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { user: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return { message: 'All notifications marked as read' };
  }
}
