import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET_KEY as string

interface IPayload {
  id: number;
  username: string;
}

export default {
  sign: (payload: IPayload) =>
    jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' }),

  verify: (token: string) => jwt.verify(token, SECRET),
};
