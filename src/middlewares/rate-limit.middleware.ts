import rateLimit, { ValueDeterminingMiddleware } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import ResponseError from "../utils/error";
import { logger } from "../utils/logging";
import { AuthRequest } from "./auth.middleware";

interface RateLimitOptions {
  max: number;
  windowMs: number;
  keyGenerator?: ValueDeterminingMiddleware<string>;
  message?: string;
  scope?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const createRateLimit = (options: RateLimitOptions) => {
  const {
    max,
    windowMs,
    message = `Too many requests, please try again later.`,
    scope = "ip",
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator,
  } = options;

  return rateLimit({
    max,
    windowMs,
    message,
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator:
      scope === "user" ? (req) => (req as AuthRequest).user.id! : undefined,
    handler: (req) => {
      const key = scope === "user" ? (req as AuthRequest).user.id! : req.ip;

      logger.warn(`Rate limit exceeded for key: ${key}`, {
        limit: max,
        windowMs,
        userAgent: req.get("User-Agent"),
      });

      throw new ResponseError(message, StatusCodes.TOO_MANY_REQUESTS);
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const rateLimitMiddleware = {
  perSecond: (max: number, scope: "user" | "ip" = "ip") =>
    createRateLimit({
      max,
      windowMs: 1000,
      scope,
    }),

  perMinute: (max: number, scope: "user" | "ip" = "ip") =>
    createRateLimit({
      max,
      windowMs: 60 * 1000,
      scope,
    }),

  perHour: (max: number, scope: "user" | "ip" = "ip") =>
    createRateLimit({
      max,
      windowMs: 60 * 60 * 1000,
      scope,
    }),

  perDay: (max: number, scope: "user" | "ip" = "ip") =>
    createRateLimit({
      max,
      windowMs: 24 * 60 * 60 * 1000,
      scope,
    }),
};
