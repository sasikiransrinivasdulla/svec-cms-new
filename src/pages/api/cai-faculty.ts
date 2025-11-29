import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, executeQuery } from '../../lib/dbPool';
import FileManager from '../../lib/fileManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    if (req.method === 'GET') {
      // Use connection pool for better performance
      // Fetch CSE-AI faculty (filter by designation or specific names to get CSE-AI faculty)
      const rows: any = await executeQuery(
        `SELECT id, name, qualification, designation, profileUrl FROM cai_faculty ORDER BY id ASC`
      );

      console.log('Fetched faculty records:', rows.length);
      
      // Transform data to match expected format
      const transformedData = Array.isArray(rows) ? rows.map((row: any) => ({
        id: row.id,
        name: row.name || '',
        qualification: row.qualification || '',
        designation: row.designation || '',
        profileUrl: row.profileUrl || '#'
      })) : [];

      console.log('Final transformed data count:', transformedData.length);
      res.status(200).json(transformedData);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const connection = await getConnection();
      try {
        // Get the record first to extract file URLs
        const [records]: any = await connection.execute(
          'SELECT * FROM cai_faculty WHERE id = ?',
          [id]
        );
        
        if ((records as any[]).length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        const record = (records as any[])[0];
        
        // Delete associated files automatically
        FileManager.cleanupRecordFiles(record);
        
        // Delete the database record
        await connection.execute('DELETE FROM cai_faculty WHERE id = ?', [id]);
        
        console.log(`Deleted CAI faculty record ${id} and associated files`);
        res.status(200).json({ message: 'Record and files deleted successfully' });
      } finally {
        connection.release();
      }
      
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const connection = await getConnection();
      try {
        // Get the existing record
        const [existingRecords]: any = await connection.execute(
          'SELECT * FROM cai_faculty WHERE id = ?',
          [id]
        );
        
        if ((existingRecords as any[]).length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        const existingRecord = (existingRecords as any[])[0];
        
        // If profileUrl is being updated, automatically replace the old file
        if (updateData.profileUrl && updateData.profileUrl !== existingRecord.profileUrl) {
          FileManager.deleteFile(existingRecord.profileUrl);
          console.log(`Automatically replaced old profile: ${existingRecord.profileUrl} with: ${updateData.profileUrl}`);
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
          `UPDATE cai_faculty SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        
        console.log(`Updated CAI faculty record ${id} with automatic file replacement`);
        res.status(200).json({ message: 'Record updated successfully, old files automatically replaced' });
      } finally {
        connection.release();
      }
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Error with cai-faculty data:', error);
    res.status(500).json({ error: 'Failed to process faculty data', details: String(error) });
  }
}
