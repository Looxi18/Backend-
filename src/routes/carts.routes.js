import express from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';


const router = express.Router();

// Crear un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: 'Carrito creado', cart: newCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
    }

    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }

    const productId = req.params.pid.trim();  

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

  
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `No hay suficiente stock disponible. Stock actual: ${product.stock}`
      });
    }

    console.log("Productos en el carrito antes de actualizar:", JSON.stringify(cart.products, null, 2));

    const productIndex = cart.products.findIndex(p => p?.product?.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      console.log(`Cantidad de producto actualizada: ${productId}, Nueva cantidad: ${quantity}`);
    } else {
      cart.products.push({ product: productId, quantity });
      console.log(`Producto añadido al carrito: ${productId}, Cantidad: ${quantity}`);
    }

    console.log("Productos en el carrito después de actualizar:", JSON.stringify(cart.products, null, 2));

    await cart.save();
    res.json({ message: 'Producto actualizado en el carrito', cart });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  }
});



// Eliminar completamente un carrito por su ID
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Buscar y eliminar el carrito
    const deletedCart = await Cart.findByIdAndDelete(cid);

    if (!deletedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json({ message: 'Carrito eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar carrito:', error);
    res.status(500).json({ message: 'Error al eliminar carrito', error: error.message });
  }
});



router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Eliminar el producto con `$pull`
    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },  // Elimina el objeto cuyo `product` coincida con `pid`
      { new: true } // Para devolver el carrito actualizado
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Verifica si el carrito tiene productos restantes después de la eliminación
    if (updatedCart.products.length === 0) {
      console.log("Carrito vacío después de eliminar el producto");
    }

    // Guardamos el carrito actualizado
    await updatedCart.save();

    res.json({ message: 'Producto eliminado del carrito', cart: updatedCart });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
  }
});

export const finalizePurchase = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    let total = 0;
    let outOfStock = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
        total += product.price * quantity;
      } else {
        outOfStock.push(product.name);
      }
    }

    // Filtrar productos comprados del carrito
    cart.products = cart.products.filter(item =>
      !outOfStock.includes(item.product.name)
    );
    await cart.save();

    if (outOfStock.length > 0) {
      return res.render('purchaseResult', {
        success: false,
        outOfStock,
        cartId
      });
    }

    return res.render('purchaseResult', {
      success: true,
      total
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al finalizar la compra');
  }
};


router.post('/cart/add/:productId', async (req, res) => {
  const { productId } = req.params;
  const quantityToAdd = parseInt(req.body.quantity) || 1;
  const cartId = req.session.cartId || req.user.cartId; // o como lo manejes

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Producto no encontrado');

    const cart = await Cart.findById(cartId).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const item = cart.products.find(p => p.product._id.toString() === productId);
    const currentQuantity = item ? item.quantity : 0;

    if (currentQuantity + quantityToAdd > product.stock) {
      return res.render('cart', {
        cart,
        error: `No se puede agregar más de ${product.stock} unidades de "${product.name}".`,
      });
    }

    if (item) {
      item.quantity += quantityToAdd;
    } else {
      cart.products.push({ product: productId, quantity: quantityToAdd });
    }

    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});


export default router;
