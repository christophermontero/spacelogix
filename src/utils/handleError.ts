import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { Response } from 'express';
import httpResponses from '../utils/responses';
import buildPayloadResponse from './buildResponsePayload';

const buildResponse = (
  res: Response,
  status: number,
  payload: { code: string; message: string }
) => res.status(status).json(buildPayloadResponse(payload));

const handleError = (res: Response, err: Error) => {
  let response;
  if (err instanceof ConflictException) {
    if (err.message === httpResponses.USER_TAKEN.message) {
      response = buildResponse(
        res,
        HttpStatus.CONFLICT,
        httpResponses.USER_TAKEN
      );
    }
    if (err.message === httpResponses.PRODUCT_EXISTS.message) {
      response = buildResponse(
        res,
        HttpStatus.CONFLICT,
        httpResponses.PRODUCT_EXISTS
      );
    }
  } else if (err instanceof NotFoundException) {
    if (err.message === httpResponses.USER_NOT_EXISTS.message) {
      response = buildResponse(
        res,
        HttpStatus.NOT_FOUND,
        httpResponses.USER_NOT_EXISTS
      );
    }
    if (err.message === httpResponses.PRODUCT_NOT_EXISTS.message) {
      response = buildResponse(
        res,
        HttpStatus.NOT_FOUND,
        httpResponses.PRODUCT_NOT_EXISTS
      );
    }
    if (err.message === httpResponses.ORDER_NOT_EXISTS.message) {
      response = buildResponse(
        res,
        HttpStatus.NOT_FOUND,
        httpResponses.ORDER_NOT_EXISTS
      );
    }
    if (err.message === httpResponses.MISSING_PRODUCTS.message) {
      response = buildResponse(
        res,
        HttpStatus.NOT_FOUND,
        httpResponses.MISSING_PRODUCTS
      );
    }
  } else if (err instanceof UnprocessableEntityException) {
    if (err.message === httpResponses.INVALID_PASSWORD.message) {
      response = buildResponse(
        res,
        HttpStatus.UNPROCESSABLE_ENTITY,
        httpResponses.INVALID_PASSWORD
      );
    }
    if (err.message === httpResponses.TOO_MANY_PRODUCTS.message) {
      response = buildResponse(
        res,
        HttpStatus.UNPROCESSABLE_ENTITY,
        httpResponses.TOO_MANY_PRODUCTS
      );
    }
  } else if (err instanceof ForbiddenException) {
    response = buildResponse(
      res,
      HttpStatus.FORBIDDEN,
      httpResponses.FORBIDDEN
    );
  } else if (err instanceof UnauthorizedException) {
    response = buildResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      httpResponses.INVALID_PASSWORD
    );
  } else {
    response = buildResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR
    );
  }

  return response;
};

export default handleError;
