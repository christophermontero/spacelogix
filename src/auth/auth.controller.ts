import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';
import { User } from '../users/interface/user.interface';
import buildPayloadResponse from '../utils/buildResponsePayload';
import handleError from '../utils/handleError';
import httpResponses from '../utils/responses';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { SigninDto, SignupDto } from './dto';
import { JwtGuard } from './guard';

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger();

  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Res() res: Response, @Body() dto: SignupDto) {
    const protectedDto = _.omit(dto, 'password');
    this.logger.debug(protectedDto, 'Auth controller :: signup');
    try {
      const accessToken = await this.authService.signup(dto);

      return res
        .status(HttpStatus.CREATED)
        .json(buildPayloadResponse(httpResponses.CREATED, accessToken));
    } catch (error) {
      this.logger.error(error.message, 'Auth controller :: signup');
      return handleError(res, error);
    }
  }

  @Post('signin')
  async signin(@Res() res: Response, @Body() dto: SigninDto) {
    const protectedDto = _.omit(dto, 'password');
    this.logger.debug(protectedDto, 'Auth controller :: signin');
    try {
      const accessToken = await this.authService.signin(dto);

      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, accessToken));
    } catch (error) {
      this.logger.error(error.message, 'Auth controller :: signin');
      return handleError(res, error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('signout')
  async signout(@GetUser() user: User, @Res() res: Response) {
    const protectedUser = this.protectUser(user);
    this.logger.debug(protectedUser, 'User controller :: signout');
    try {
      await this.authService.signout(user.email);
      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, { user: protectedUser }));
    } catch (error) {
      this.logger.error(error.message, 'Auth controller :: signout');
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
