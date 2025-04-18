import Cart from '../models/cart.model.js'; 
import Product from '../models/product.model.js';

export const finalizePurchase = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.product');
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    if (cart.products.length === 0) {
      return res.render('purchaseResult', { success: false, outOfStock: [], total: 0 });
    }

    const outOfStock = [];
    let total = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        total += product.price * item.quantity;
      } else {
        outOfStock.push(product.name);
      }
    }

    // Eliminar solo los productos que se compraron (los que no tienen problemas de stock quedan en el carrito)
    cart.products = cart.products.filter(item => outOfStock.includes(item.product.name));
    await cart.save();

    if (outOfStock.length > 0) {
      return res.render('purchaseResult', { success: false, outOfStock });
    }

    res.render('purchaseResult', { success: true, total });

  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).json({ message: 'Error al finalizar la compra', error: error.message });
  }
};
