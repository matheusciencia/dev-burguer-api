import bcrypt from 'bcrypt';
import User from '../models/User.js';
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(req.body, { strict: true });

    const genericError = () => {
      return res.status(401).json({ error: 'E-mail or password is invalid' });
    };

    if (!isValid) {
      genericError();
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      genericError();
    }

    const validPassword = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    if (!validPassword) {
      genericError();
    }

    console.log('Usuário logado com sucesso');

    const token = jwt.sign(
      {
        id: existingUser.id,
        admin: existingUser.admin,
        name: existingUser.name,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      },
    );

    return res.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
      token,
    });
  }
}

export default new SessionController();
