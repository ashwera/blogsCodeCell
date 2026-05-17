import { connectDB } from '../../../lib/db.js';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required')
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const Item = (await import('../../../server/models/Item.js')).default;

    if (req.method === 'GET') {
      const items = await Item.find();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const parsed = itemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Please add a name and description field', errors: parsed.error.errors });
      }

      const item = await Item.create({
        name: parsed.data.name,
        description: parsed.data.description,
      });

      return res.status(201).json(item);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
