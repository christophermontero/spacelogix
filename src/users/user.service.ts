import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { EditUserDto } from './dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async update(userId: number, dto: EditUserDto) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { id: userId },
        {
          ...(dto.name && { name: dto.name }),
          ...(dto.phone && { name: dto.phone }),
          ...(dto.country && { name: dto.country }),
          ...(dto.city && { name: dto.city }),
          ...(dto.address && { name: dto.address })
        },
        { new: true }
      );

      return _.omit(user, 'hashedPassword');
    } catch (error) {
      this.logger.error(error.message, 'User service :: update');
      throw error;
    }
  }
}
