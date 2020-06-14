import JWT from 'jsonwebtoken';
import { promisify } from 'util';
import authSettings from '../../settings/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: "You're not allowed" });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodToken = await promisify(JWT.verify)(token, authSettings.secrect);

    req.userId = decodToken.id;

    return next();
  } catch {
    return res.status(401).json({ status: "You're not allowed" });
  }
};
