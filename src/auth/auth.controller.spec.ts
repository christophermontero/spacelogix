import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UserModel } from '../../test/mockData/user.model.mock';
import { User, UserRole } from '../users/interface/user.interface';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let user: Partial<User>;
  let dto: Partial<SignupDto | SigninDto>;
  let accessToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: 'UserModel',
          useValue: UserModel
        }
      ]
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    user = { email: 'johndoe@mailinator.com' };
    dto = {
      name: 'John Doe',
      email: 'johndoe@mailinator.com',
      password: '123456789',
      phone: '98765432',
      address: 'Fake St. 123',
      city: 'John Doe City',
      country: 'John Doe Country',
      role: UserRole.Customer
    };
    accessToken = '12345';
  });

  describe('signup', () => {
    it('should signup a new user', async () => {
      authService.signup = jest.fn().mockResolvedValue(accessToken);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await authController.signup(
        res as Response,
        dto as SignupDto
      );
      expect(authService.signup).toHaveBeenCalledWith(dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });
  });

  describe('signin', () => {
    it('should signin a existing user', async () => {
      authService.signin = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await authController.signin(
        res as Response,
        dto as SigninDto
      );
      expect(authService.signin).toHaveBeenCalledWith(dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('signout', () => {
    it('should signout a existing user', async () => {
      authService.signout = jest.fn().mockResolvedValue([{}]);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await authController.signout(
        user as User,
        res as Response
      );
      expect(authService.signout).toHaveBeenCalled();
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
