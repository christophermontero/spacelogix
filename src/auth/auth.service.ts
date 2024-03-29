import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { User, UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { SigninDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: SignupDto) {
    try {
      let user = await this.userModel.findOne({ email: dto.email });

      if (user) {
        throw new ConflictException(httpResponses.USER_TAKEN.message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      const userDto: Partial<User> = {
        ...dto,
        hashedPassword
      };
      user = await new this.userModel(userDto);
      await user.save();
      return this.signToken(user.id, user.email, user.role);
    } catch (error) {
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user) {
        throw new NotFoundException(httpResponses.USER_NOT_EXISTS.message);
      }

      const hashedPassword = _.get(user, 'hashedPassword', '');
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        hashedPassword
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(httpResponses.INVALID_PASSWORD.message);
      }
      return this.signToken(user.id, user.email, user.role);
    } catch (error) {
      throw error;
    }
  }

  async signout(email: string) {
    try {
      return await this.userModel.findOneAndUpdate(
        { email },
        {
          updatedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  private async signToken(userId: number, email: string, role: UserRole) {
    const payload = {
      sub: userId,
      email,
      role
    };
    const jwtOptions: JwtSignOptions = {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRATION_SECONDS'),
      secret: this.config.get('JWT_SECRET')
    };
    const token = await this.jwt.signAsync(payload, jwtOptions);
    return { token };
  }
}
