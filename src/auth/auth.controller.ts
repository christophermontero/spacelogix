import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';
import buildPayloadResponse from 'src/utils/buildResponsePayload';
import handleError from 'src/utils/handleError';
import httpResponses from 'src/utils/responses';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

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
}
