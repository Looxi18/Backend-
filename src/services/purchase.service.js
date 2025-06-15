import Ticket from '../models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

export const finalizePurchase = async (req, res) => {
  const { cid } = req.params;
  const userEmail = req.user.email;

  const cart = await Cart.findById(cid).populate('products.product');
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

  const outOfStock = [];
  let total = 0;

  for (const item of cart.products) {
    const product = await Product.findById(item.product._id);
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      total += product.price * item.quantity;
      await product.save();
    } else {
      outOfStock.push(product.name);
    }
  }

  cart.products = cart.products.filter(item => outOfStock.includes(item.product.name));
  await cart.save();

  if (total > 0) {
    const ticket = new Ticket({
      code: uuidv4(),
      amount: total,
      purchaser: userEmail
    });

    await ticket.save();
    return res.render('purchaseResult', { success: true, total });
  }

  res.render('purchaseResult', { success: false, outOfStock });
};
