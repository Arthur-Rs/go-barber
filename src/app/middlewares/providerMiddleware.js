import UserModel from '../models/UserModel';

export default async (req, res, next) => {
  const { userId } = req;

  const filter = { where: { id: userId, provider: true } };

  const isProvider = await UserModel.findOne(filter).catch(() => {
    return res.status(500).json({ status: 'Error in Database!' });
  });

  if (!isProvider) {
    return res.status(401).json({ status: "You're not allowed" });
  }

  return next();
};
