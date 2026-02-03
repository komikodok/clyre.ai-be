import express from "express";
import routes from "./routes";
import cors from "cors";
import { errorMiddleware } from "../middlewares/error.middleware";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";

const app = express();

app.use(rateLimitMiddleware.perMinute(100, "ip"));
app.use(rateLimitMiddleware.perHour(1000, "ip"));

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
