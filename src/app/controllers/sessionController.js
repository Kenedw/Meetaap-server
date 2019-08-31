import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import User from '../models/user';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      password: yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(406).json({ error: 'Password does not math' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expriresIn,
      }),
    });
  }
}

export default new SessionController();
