import * as Yup from 'yup';
import UserModel from '../models/UserModel';

class UseController {
  async store(req, res) {
    // ======= Validation ======= \\

    const schema = Yup.object().shape({
      name: Yup.string().min(3).max(32).required(),
      email: Yup.string().email().max(64).required(),
      password: Yup.string().min(6).max(32).required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Icomplete body!');
    }

    // ========================== \\

    await UserModel.create(req.body).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    return res.json({ status: 'User create with success!' });
  }

  async update(req, res) {
    // ======= Validation ======= \\

    const schema = Yup.object().shape({
      name: Yup.string().min(3).max(32),
      email: Yup.string().email().max(64),
      oldPassword: Yup.string().min(6).max(32),
      avatar_id: Yup.number().positive(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ status: 'Icomplete body!' });
    }

    // ========================== \\

    const data = req.body;
    const { oldPassword } = data;
    const { userId } = req;

    const User = await UserModel.findByPk(userId);

    if (oldPassword && !(await User.ComparePassword(oldPassword))) {
      return res.status(401).json('Icorrect Password!');
    }

    await User.update(data).catch(() => {
      return res.status(500).json({ status: 'Error in database! 1' });
    });

    return res.json({ status: 'Successful Change!' });
  }
}

export default new UseController();
