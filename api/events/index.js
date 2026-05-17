import { connectDB } from '../../../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const Event = (await import('../../../server/models/Event.js')).default;
    
    const { blog_id, type, time_spent } = req.body;
    
    if (!blog_id || !['view', 'read'].includes(type)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const event = new Event({
      blog_id,
      type,
      time_spent: type === 'read' ? time_spent : undefined,
      created_at: new Date()
    });

    await event.save();
    res.status(201).json({ message: 'Event logged' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
