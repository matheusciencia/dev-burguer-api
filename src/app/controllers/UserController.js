import User from '../models/User.js';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false, strict: true });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Validation failed', messages: error.errors });
    }

    const { name, email, password, admin } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'E-mail already exists' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    try {
      const user = await User.create({
        name,
        email,
        password_hash,
        admin,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
