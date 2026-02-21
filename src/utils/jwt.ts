import "dotenv/config";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET_KEY as string;

interface IPayload {
  id: string;
  username: string;
}

export default {
  sign: (payload: IPayload) =>
    jwt.sign(payload, SECRET, { expiresIn: "4H", algorithm: "HS256" }),

  verify: (token: string) => jwt.verify(token, SECRET),
};
