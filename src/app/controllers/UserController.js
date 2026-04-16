import User from "../models/User.js";
import * as Yup from "yup";


class UserController {
    async store (req, res) {


    const schema = Yup.object({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password_hash: Yup.string().min(6).required(),
        admin: Yup.boolean(),
    });

    
    try {
        await schema.validate(req.body, { abortEarly: false, strict: true });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Validation failed", messages: error.errors });
    }

    const { name, email, password_hash, admin } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        return res.status(400).json({ error: "E-mail already exists" });
    }

    const user = await User.create({
      name,
      email,
      password_hash,
      admin
    });

    return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin
    });


  
}
}

export default new UserController();