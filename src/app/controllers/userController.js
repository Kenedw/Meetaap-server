import * as yup from 'yup';

import User from '../models/user';

class UserController {
  async store(req, res) {
    const schema = yup.object.shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      password: yup
        .string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: yup
        .string()
        .when('password', (password, field) =>
          password ? field.required : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { confirmPassword, password, email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ email: 'Email already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ oldPassword: 'Password does not math' });
    }

    if (confirmPassword !== password) {
      return res.status(401).json({
        confirmPassword: 'Confirmation of password not equal password',
      });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
