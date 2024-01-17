import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UserModel } from '../../test/mockData/user.model.mock';
import { EditUserDto } from './dto';
import { User } from './interface/user.interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        JwtService,
        ConfigService,
        {
          provide: 'UserModel',
          useValue: UserModel
        }
      ]
    }).compile();
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('profile', () => {
    const user: Partial<User> = { email: 'johndoe@mail.com' };

    it('should get user profile', async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await userController.profile(
        user as User,
        res as Response
      );
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('update', () => {
    let dto: Partial<EditUserDto>;
    let userId: string;

    beforeAll(() => {
      dto = {
        name: 'new name'
      };
      userId = 'userId';
    });

    it('should update a existing user', async () => {
      userService.update = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await userController.update(
        userId,
        res as Response,
        dto as EditUserDto
      );
      expect(userService.update).toHaveBeenCalledWith(userId, dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw an error when is updating the user', async () => {
      const mockError = new Error('Updating user error');
      userService.update = jest.fn().mockRejectedValue(mockError);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await userController.update(
        userId,
        res as Response,
        dto as EditUserDto
      );
      expect(userService.update).toHaveBeenCalledWith(userId, dto);
      expect(result.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  });
});
