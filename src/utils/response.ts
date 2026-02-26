import { Response } from "express";
import { logger } from "./logging";

const successResponse = (
  res: Response,
  code: number,
  message: string,
  data: any,
) => {
  return res.status(code).json({
    meta: {
      code,
      status: "success",
      message,
    },
    ...data,
  });
};

const errorResponse = (
  res: Response,
  code: number,
  message: string,
  error: any,
) => {
  logger.error({
    meta: {
      code,
      status: "error",
      message,
    },
    error: error,
  });

  let safeError;
  try {
    JSON.stringify(error);
    safeError = error;
  } catch {
    safeError = error ? { message: error.message, name: error.name } : null;
  }

  return res.status(code).json({
    meta: {
      code,
      status: "error",
      message,
    },
    error: safeError,
  });
};

export { successResponse, errorResponse };
