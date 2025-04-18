import express from 'express';
import Cart from '../../models/cart.model.js';
import Product from '../../models/product.model.js';

const router = express.Router();

// GET /api/carts/:cid - obtener un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
});

// POST /api/carts - crear un carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: 'Carrito creado', cart: newCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear carrito', error: error.message });
  }
});

// PUT /api/carts/:cid/product/:pid - actualizar cantidad de producto
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json({ message: 'Producto actualizado en carrito', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar carrito', error: error.message });
  }
});

// DELETE /api/carts/:cid/product/:pid - eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    if (!updatedCart) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.json({ message: 'Producto eliminado del carrito', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
  }
});

export default router;
