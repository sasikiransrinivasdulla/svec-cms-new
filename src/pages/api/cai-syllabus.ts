import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import FileManager from '../../lib/fileManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await mysql.createConnection({
    host: '62.72.31.209',
    user: 'cmsuser',
    password: 'V@savi@2001',
    database: 'svec_cms'
  });

  try {
    if (req.method === 'GET') {
      console.log('Fetching syllabus data...');
      const startTime = Date.now();

      // Optimized query with index on type and academic_year
      const [rows]: any = await connection.execute(
        'SELECT id, type, title, fileUrl, academic_year FROM cai_syllabus ORDER BY id ASC LIMIT 50'
      );

      const queryTime = Date.now() - startTime;
      console.log(`Query completed in ${queryTime}ms, found ${rows.length} records`);
      
      // Transform data efficiently
      const transformedData = rows.map((row: any) => ({
        id: row.id,
        type: row.type || 'R20',
        title: row.title || 'Untitled',
        fileUrl: row.fileUrl || '#',
        academic_year: row.academic_year || '2023-24'
      }));

      console.log('Data transformation completed');
      res.status(200).json(transformedData);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Get the record first to extract file URLs
      const [records] = await connection.execute(
        'SELECT * FROM cai_syllabus WHERE id = ?',
        [id]
      );
      
      if ((records as any[]).length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const record = (records as any[])[0];
      
      // Delete associated files automatically
      FileManager.cleanupRecordFiles(record);
      
      // Delete the database record
      await connection.execute('DELETE FROM cai_syllabus WHERE id = ?', [id]);
      
      console.log(`Deleted CAI syllabus record ${id} and associated files`);
      res.status(200).json({ message: 'Record and files deleted successfully' });
      
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Get the existing record
      const [existingRecords] = await connection.execute(
        'SELECT * FROM cai_syllabus WHERE id = ?',
        [id]
      );
      
      if ((existingRecords as any[]).length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      const existingRecord = (existingRecords as any[])[0];
      
      // If file URL is being updated, automatically replace the old file
      if (updateData.fileUrl && updateData.fileUrl !== existingRecord.fileUrl) {
        FileManager.deleteFile(existingRecord.fileUrl);
        console.log(`Automatically replaced old file: ${existingRecord.fileUrl} with: ${updateData.fileUrl}`);
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
        `UPDATE cai_syllabus SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      
      console.log(`Updated CAI syllabus record ${id} with automatic file replacement`);
      res.status(200).json({ message: 'Record updated successfully, old files automatically replaced' });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('CAI syllabus API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await connection.end();
  }
}
