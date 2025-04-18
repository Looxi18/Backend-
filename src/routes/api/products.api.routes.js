import express from 'express';
import Product from '../../models/product.model.js';

const router = express.Router();

// GET /api/products con filtros, orden y paginación
router.get('/', async (req, res) => {
  try {
    const { category, availability, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (availability) {
      if (availability === 'true') query.stock = { $gt: 0 };
      else if (availability === 'false') query.stock = 0;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: {},
      lean: true
    };

    if (sort === 'asc') {
      options.sort.price = 1;
    } else if (sort === 'desc') {
      options.sort.price = -1;
    }


    const skip = (options.page - 1) * options.limit;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(options.sort)
      .skip(skip)
      .limit(options.limit)
      .lean();

    const totalPages = Math.ceil(totalProducts / options.limit);

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        page: options.page,
        limit: options.limit,
        hasPrevPage: options.page > 1,
        hasNextPage: options.page < totalPages
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

export default router;
