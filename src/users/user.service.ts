import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model, Types } from 'mongoose';
import { EditUserDto } from './dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async update(userId: string, dto: EditUserDto) {
    this.logger.debug({ userId, dto }, 'User service :: update');
    const objectIdUserId = new Types.ObjectId(userId);
    try {
      const user = await this.userModel.findByIdAndUpdate(
        objectIdUserId,
        {
          ...(dto.name && { name: dto.name }),
          ...(dto.phone && { phone: dto.phone }),
          ...(dto.country && { country: dto.country }),
          ...(dto.city && { city: dto.city }),
          ...(dto.address && { address: dto.address })
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
