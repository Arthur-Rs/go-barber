import UserModel from '../models/UserModel';

export default async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    next();
  }

  const CheckingEmail = await UserModel.findOne({
    where: { email: req.body.email },
  }).catch(() => {
    return res.status(500).json({ status: 'Error in database!' });
  });

  if (CheckingEmail) {
    return res.status(400).json({ status: 'This email already exists' });
  }

  return next();
};
