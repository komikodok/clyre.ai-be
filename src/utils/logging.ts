import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      const formattedMessage =
        typeof message === "object"
          ? JSON.stringify(message, null, 2)
          : message;

      return `[${timestamp}] ${level}: ${formattedMessage}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export { logger };
