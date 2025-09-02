import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as admin from 'firebase-admin';


@Injectable()
export class NotificationService {
  constructor() {

  }
  async sendPushNotification(createNotificationDto: CreateNotificationDto) {
    const { token, title, description } = createNotificationDto;

    const message = {
      notification: {
        title,
        body: description,
      },
      token,
    };
    try {
      const response = await admin.messaging().send(message);
      console.log('Push notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
