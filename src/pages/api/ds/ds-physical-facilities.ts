import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../lib/dbPool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { type, category } = req.query;
      let query = "SELECT id, category, title, description, document_url as file_url, status FROM ds_physical_facilities";
      const params: any[] = [];

      // Filter by type or category if provided
      if (type) {
        query += " WHERE category = ?";
        params.push(type);
      } else if (category) {
        query += " WHERE category = ?";
        params.push(category);
      }

      query += " ORDER BY id ASC";

      const rows: any = await executeQuery(query, params);

      res.status(200).json(rows);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}