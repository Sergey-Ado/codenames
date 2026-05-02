export enum Endpoints {
  BASE = '/',
  USER = '/api/user',
  LOGIN = '/api/login',
  REGISTER = '/api/register',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
