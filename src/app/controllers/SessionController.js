import JWT from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/UserModel';
import authSettings from '../../settings/auth';

class SessionController {
  async store(req, res) {
    // ======= Validation ======= \\

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Icomplete body!');
    }

    // ========================== \\

    const { email, password } = req.body;

    const UserConfirm = await User.findOne({ where: { email } }).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    if (!UserConfirm) {
      return res.status(401).json({ status: 'This user not exist!' });
    }

    const passwordConfirm = await UserConfirm.ComparePassword(password);

    if (!passwordConfirm) {
      return res.status(401).json({ status: 'Icorrect password' });
    }

    const { id, name } = UserConfirm;

    return res.json({
      id,
      name,
      email,
      token: JWT.sign({ id }, authSettings.secrect, {
        expiresIn: authSettings.expiresIn,
      }),
    });
  }
}

export default new SessionController();
