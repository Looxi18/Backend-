import express from 'express';
import Product from '../models/product.model.js'; 
import Cart from '../models/cart.model.js';
import { finalizePurchase } from '../controllers/carts.controller.js';


const router = express.Router();

// Login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesión' });
});

// Registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});

// Formulario para restablecer contraseña con token
router.get('/auth/reset-password/:token', (req, res) => {
  const { token } = req.params;
  res.render('resetPasswordForm', { title: 'Nueva contraseña', token });
});


// Solicitud de recuperación de contraseña
router.get('/auth/reset-password', (req, res) => {
  res.render('resetPasswordRequest', { title: 'Recuperar contraseña' });
});

// Ruta para la página principal (mostrar productos)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', { products }); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});

const DEFAULT_CART_ID = '684dabcc3d33e3d5cfa1cf9d';


router.get('/cart/add/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    const cart = await Cart.findById(DEFAULT_CART_ID);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.product.toString() === req.params.pid);
    const currentQuantity = existingProduct ? existingProduct.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      return res.render('home', {
        products: await Product.find().lean(),
        error: `No se puede agregar más de ${product.stock} unidades de "${product.name}".`,
      });
    }

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    await cart.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).send('Error interno');
  }
});



router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne({}).populate('products.product'); 
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Convertir el carrito a un objeto plano para evitar problemas con Handlebars
    const cartObject = cart.toObject();

    // Calcular el total de todos los productos en el carrito
    let total = 0;
    cartObject.products.forEach(item => {
      total += item.product.price * item.quantity;
    });

    res.render('cart', { cart: cartObject, total });  // Pasamos el carrito convertido a la vista
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});


// Ruta para agregar más cantidad de un producto al carrito
router.post('/cart/add-more/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const { quantity } = req.body;

    // Buscar el producto
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Buscar el carrito
    const cart = await Cart.findOne({});
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Verificar si el producto está en el carrito
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    // Verificar stock
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'No hay suficiente stock' });
    }

    // Actualizar la cantidad
    cart.products[productIndex].quantity = quantity;

    // Guardar los cambios
    await cart.save();

    res.redirect('/cart');  // Redirigir al carrito actualizado
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ message: 'Error al actualizar cantidad en el carrito', error: error.message });
  }
});

// Ruta para eliminar un producto del carrito
router.post('/cart/remove/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    // Buscar el carrito
    const cart = await Cart.findOne({});
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Encontrar el producto en el carrito y eliminarlo
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    // Eliminar el producto del carrito
    cart.products.splice(productIndex, 1);

    // Guardar los cambios en el carrito
    await cart.save();

    res.redirect('/cart'); //Redirigir al carrito actualizado
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
  }
});

router.post('/cart/:cid/purchase', finalizePurchase);

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean(); // .lean() para que funcione con Handlebars
    res.render('products', { products });
  } catch (err) {
    res.status(500).send('Error al cargar los productos');
  }
});


// Vista resultado compra
router.get('/purchase/result', (req, res) => {

  res.render('purchaseResult', {
    success: true,
    total: 1000,
    outOfStock: []
  });
});


export default router;
