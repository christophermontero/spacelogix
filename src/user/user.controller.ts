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
import buildPayloadResponse from 'src/utils/buildResponsePayload';
import handleError from 'src/utils/handleError';
import httpResponses from 'src/utils/responses';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { Users } from './interface/users.interface';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger();

  constructor(private userService: UserService) {}

  @Get('me')
  async profile(@GetUser() user: Users, @Res() res: Response) {
    const protectedUser = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
      address: user.address,
      role: user.role
    };
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
}
