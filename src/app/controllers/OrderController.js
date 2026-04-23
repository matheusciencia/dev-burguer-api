import * as Yup from 'yup';
import Product from '../models/Products.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js';

class OrderController {
  async store(req, res) {
    req.body.price = req.body.price?.replace(',', '.');

    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      await schema.validate(req.body, { abortEarly: false, strict: true });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Validation failed', messages: error.errors });
    }

    const { userId, userName } = req;
    const { products } = req.body;

    const productsId = products.map((product) => product.id);

    const findedProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: {
        model: Category,
        as: 'category',
        attributes: ['name'],
      },
    });

    const formattedProducts = findedProducts.map((product) => {
      const quantity = products.find((p) => p.id === product.id).quantity;

      const mappedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        url: product.url,
        category: product.category.name,
        quantity,
      };

      return mappedProduct;
    });

    const order = {
      user: {
        id: userId,
        name: userName,
      },
      products: formattedProducts,
      status: 'Pedido realizado!',
    };

    const newOrder = await Order.create(order);

    return res.status(200).json(newOrder);
  }
}

export default new OrderController();
