import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, executeQuery } from '../../lib/dbPool';
import FileManager from '../../lib/fileManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Using connection pool

  try {
    if (req.method === 'GET') {
      console.log('Fetching CAI non-teaching staff...');
      const startTime = Date.now();

      const rows: any = await executeQuery(`
        SELECT id, name, designation 
        FROM cai_non_teaching_faculty
        WHERE dept = 'cse-ai'
        ORDER BY id DESC 
        LIMIT 50
      `);
      
      console.log('CAI staff query time:', Date.now() - startTime, 'ms');
      console.log('CAI staff records found:', (rows as any[]).length);

      res.status(200).json(rows);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Get the record first to extract file URLs
      const rows: any = await executeQuery(
        'SELECT * FROM cai_staff WHERE id = ?',
        [id]
      );
      
      if ((records as any[]).length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const record = (records as any[])[0];
      
      // Delete associated files automatically
      FileManager.cleanupRecordFiles(record);
      
      // Delete the database record
      await connection.execute('DELETE FROM cai_staff WHERE id = ?', [id]);
      
      console.log(`Deleted CAI staff record ${id} and associated files`);
      res.status(200).json({ message: 'Record and files deleted successfully' });
      
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Get the existing record
      const rows: any = await executeQuery(
        'SELECT * FROM cai_staff WHERE id = ?',
        [id]
      );
      
      if ((existingRecords as any[]).length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const existingRecord = (existingRecords as any[])[0];
      
      // If any file URL fields are being updated, automatically replace old files
      // Check for changes in file URLs and delete old files before updating
      const fileFields = ['profileUrl', 'imageUrl', 'fileUrl', 'gallery'];
      for (const field of fileFields) {
        if (updateData[field] && existingRecord[field] && updateData[field] !== existingRecord[field]) {
          FileManager.deleteFile(existingRecord[field]);
          console.log(`Automatically replaced old file in ${field}: ${existingRecord[field]} with: ${updateData[field]}`);
        }
      }
      
      // Update the record
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (key !== 'id') {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      updateValues.push(id);
      
      await connection.execute(
        `UPDATE cai_staff SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      
      console.log(`Updated CAI staff record ${id} with automatic file replacement`);
      res.status(200).json({ message: 'Record updated successfully, old files automatically replaced' });
      
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Error fetching CAI staff:', error);
    res.status(500).json({ 
      message: 'Error fetching CAI staff data',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  } 
}
