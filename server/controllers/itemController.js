const Item = require('../models/Item');
const { z } = require('zod');

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required')
});

// @desc    Get items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Set item
// @route   POST /api/items
// @access  Public
const setItem = async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Please add a name and description field', errors: parsed.error.errors });
  }

  try {
    const item = await Item.create({
      name: parsed.data.name,
      description: parsed.data.description,
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getItems,
  setItem,
};
