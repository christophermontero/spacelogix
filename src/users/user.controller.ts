import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';
import buildPayloadResponse from '../utils/buildResponsePayload';
import handleError from '../utils/handleError';
import httpResponses from '../utils/responses';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger();

  constructor(private userService: UserService) {}

  @Get('me')
  async profile(@GetUser() user: User, @Res() res: Response) {
    const protectedUser = this.protectUser(user);
    this.logger.debug(protectedUser, 'User controller :: profile');
    return res
      .status(HttpStatus.OK)
      .json(buildPayloadResponse(httpResponses.OK, { user: protectedUser }));
  }

  @Patch()
  async update(
    @GetUser('id') userId: number,
    @Res() res: Response,
    @Body() dto: EditUserDto
  ) {
    this.logger.debug(dto, 'User controller :: update');
    try {
      const updateUser = await this.userService.update(userId, dto);

      return res
        .status(HttpStatus.CREATED)
        .json(buildPayloadResponse(httpResponses.OK, updateUser));
    } catch (error) {
      this.logger.error(error.message, 'User controller :: update');
      return handleError(res, error);
    }
  }

  private protectUser(user: unknown) {
    return _.pick(
      user,
      '_id',
      'name',
      'email',
      'phone',
      'country',
      'city',
      'address',
      'role',
      'updatedAt'
    );
  }
}
