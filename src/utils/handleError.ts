import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { Response } from 'express';
import httpResponses from 'src/utils/responses';
import buildPayloadResponse from './buildResponsePayload';

const buildResponse = (
  res: Response,
  status: number,
  payload: { code: string; message: string }
) => res.status(status).json(buildPayloadResponse(payload));

const handleError = (res: Response, err: Error) => {
  let response;
  if (err instanceof ConflictException) {
    response = buildResponse(
      res,
      HttpStatus.CONFLICT,
      httpResponses.USER_TAKEN
    );
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
  } else if (err instanceof UnprocessableEntityException) {
    response = buildResponse(
      res,
      HttpStatus.UNPROCESSABLE_ENTITY,
      httpResponses.INVALID_PASSWORD
    );
  } else if (err instanceof ForbiddenException) {
    response = buildResponse(
      res,
      HttpStatus.FORBIDDEN,
      httpResponses.FORBIDDEN
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
