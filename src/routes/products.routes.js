import express from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
const router = express.Router();

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, category, stock, imageUrl });
    await newProduct.save();
    res.status(201).json({ message: 'Producto creado', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
});


// Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
});


// Eliminar un producto de la base de datos y de todos los carritos
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    // Eliminar el producto de la colección de productos
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar el producto de todos los carritos donde está presente
    const updatedCarts = await Cart.updateMany(
      { 'products.product': productId }, // Buscamos carritos que contengan este producto
      { $pull: { products: { product: productId } } } // Eliminamos el producto de esos carritos
    );

    // Si no se actualizó ningún carrito, informar al usuario
    if (updatedCarts.matchedCount === 0) {
      console.log(`No se encontraron carritos con el producto ${productId}`);
    }

    // Retornar un mensaje de éxito
    res.json({ message: 'Producto eliminado y actualizado en los carritos' });

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});


export default router;


