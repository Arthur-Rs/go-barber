import UserModel from '../models/UserModel';

export default async (req, res, next) => {
  if (!req.body.email) {
    return next();
  }

  const email = await UserModel.findOne({
    where: { email: req.body.email },
  }).catch(() => {
    return res.status(500).json({ message: 'Error in database!' });
  });

  if (email) {
    return res.status(400).json({ message: 'Existing Email!' });
  }

  return next();
};
