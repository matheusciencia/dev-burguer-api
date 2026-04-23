import * as Yup from 'yup';
import Product from '../models/Products.js';
import Category from '../models/Category.js';

class ProductController {
  async store(req, res) {
    req.body.price = req.body.price?.replace(',', '.');

    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Validation failed', messages: error.errors });
    }

    const { name, price, category_id, offer } = req.body;
    const { filename } = req.file;

    const newProduct = await Product.create({
      name,
      price,
      category_id,
      path: filename,
      offer,
    });

    return res.status(201).json(newProduct);
  }

  async update(req, res) {
    req.body.price = req.body.price?.replace(',', '.');

    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Validation failed', messages: error.errors });
    }
    const { id } = req.params;
    const { name, price, category_id, offer } = req.body;

    let path;

    if (req.file) {
      const { filename } = req.file;
      path = filename;
    }

    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json();
  }

  async index(_req, res) {
    const products = await Product.findAll(
      {
        include: {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      },
      {},
    );

    console.log(_req.userId);

    return res.status(200).json(products);
  }
}

export default new ProductController();
