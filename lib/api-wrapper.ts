import { NextRequest } from 'next/server';
import { handleError } from './api-error';

type RouteHandler = (
  req: NextRequest,
  params: { params: Record<string, string> }
) => Promise<Response>;

export const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req: NextRequest, params: { params: Record<string, string> }) => {
    try {
      return await handler(req, params);
    } catch (error) {
      return handleError(error);
    }
  };
};

export const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};
