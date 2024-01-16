import {
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

class MockUserModel {
  constructor(private readonly data: any) {}
  static findOne(conditions: any): MockUserModel {
    return new MockUserModel({});
  }
  static findOneAndUpdate(
    conditions: any,
    update: any,
    options: any
  ): MockUserModel {
    return new MockUserModel({});
  }
  async save(): Promise<MockUserModel> {
    return Promise.resolve(new MockUserModel({}));
  }
}

class MockJwtService {
  signAsync(payload: any, options?: any): Promise<string> {
    return Promise.resolve('mocked-jwt-token');
  }
}

class MockConfigService {
  get(key: string): any {
    if (key === 'JWT_ACCESS_EXPIRATION_SECONDS') {
      return 3600;
    }
    if (key === 'JWT_SECRET') {
      return 'secret-key';
    }
  }
}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: MockUserModel
        },
        {
          provide: JwtService,
          useClass: MockJwtService
        },
        {
          provide: ConfigService,
          useClass: MockConfigService
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      name: 'Customer1',
      email: 'customer1@mailinator.com',
      password: 'password1234567890',
      phone: '98765432',
      address: 'Fake St. 123',
      city: 'Customer1 City',
      country: 'Customer1 Country',
      role: UserRole.Customer
    };

    it('should register a new user', async () => {
      const findSpy = jest
        .spyOn(MockUserModel, 'findOne')
        .mockResolvedValue(null as never);
      const signSpy = jest.spyOn(MockJwtService.prototype, 'signAsync');
      const getSpy = jest.spyOn(MockConfigService.prototype, 'get');
      const result = await authService.signup(signupDto as SignupDto);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('token');
    });

    it('should throw ConflictException if the email is already taken', async () => {
      jest
        .spyOn(MockUserModel, 'findOne')
        .mockResolvedValue(new MockUserModel({}) as never);
      await expect(authService.signup(signupDto as SignupDto)).rejects.toThrow(
        new ConflictException(httpResponses.USER_TAKEN.message)
      );
    });

    it('should throw an error when is creating a new user', async () => {
      const mockError = new Error('Creating user error');
      jest
        .spyOn(MockUserModel, 'findOne')
        .mockRejectedValue(mockError as never);
      await expect(authService.signup(signupDto as SignupDto)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'customer1@mailinator.com',
      password: 'password1234567890',
      role: UserRole.Customer
    };

    it('should sign in a user', async () => {
      const findSpy = jest.spyOn(MockUserModel, 'findOne').mockResolvedValue({
        hashedPassword:
          '$2b$10$4JqH6AnDi9.8fPPG4CX1DehE.A1iDHJdJ/E.2tX.UVQm/ynfiBbyu'
      } as never);
      const signSpy = jest.spyOn(MockJwtService.prototype, 'signAsync');
      const getSpy = jest.spyOn(MockConfigService.prototype, 'get');
      const result = await authService.signin(signinDto);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('token');
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      jest.spyOn(MockUserModel, 'findOne').mockResolvedValue(null as never);
      await expect(authService.signin(signinDto)).rejects.toThrow(
        new NotFoundException(httpResponses.USER_NOT_EXISTS.message)
      );
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      jest.spyOn(MockUserModel, 'findOne').mockResolvedValue({
        hashedPassword:
          '$2b$10$4JqH6AnDi9.8fPPG4CX1DehE.A1iDHJdJ/E.2tX.UVQm/ynfiBbyf'
      } as never);
      jest.spyOn(MockJwtService.prototype, 'signAsync');
      jest.spyOn(MockConfigService.prototype, 'get');
      await expect(authService.signin(signinDto)).rejects.toThrow(
        new UnauthorizedException(httpResponses.INVALID_PASSWORD.message)
      );
    });

    it('should throw an error when is starting session', async () => {
      const mockError = new Error('Starting user error');
      jest
        .spyOn(MockUserModel, 'findOne')
        .mockRejectedValue(mockError as never);
      await expect(authService.signin(signinDto as SigninDto)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('signout', () => {
    const email = 'customer1@mailinator.com';

    it('should update the user and return the updated user', async () => {
      const updateSpy = jest.spyOn(MockUserModel, 'findOneAndUpdate');
      await authService.signout(email);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is updating session', async () => {
      const mockError = new Error('Updating user error');
      jest
        .spyOn(MockUserModel, 'findOneAndUpdate')
        .mockRejectedValue(mockError as never);
      await expect(authService.signout(email)).rejects.toThrow(mockError);
    });
  });
});
