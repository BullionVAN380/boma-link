export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        isOperational: error.isOperational
      }),
      { 
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // For unhandled errors, log them and return a generic error
  console.error('Unhandled error:', error);
  
  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      isOperational: false
    }),
    { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

export const throwIfNotFound = (item: any, message = 'Resource not found') => {
  if (!item) {
    throw new ApiError(404, message);
  }
  return item;
};

export const throwIfUnauthorized = (condition: boolean, message = 'Unauthorized') => {
  if (!condition) {
    throw new ApiError(401, message);
  }
};

export const throwIfForbidden = (condition: boolean, message = 'Forbidden') => {
  if (!condition) {
    throw new ApiError(403, message);
  }
};

export const throwIfBadRequest = (condition: boolean, message = 'Bad request') => {
  if (!condition) {
    throw new ApiError(400, message);
  }
};
