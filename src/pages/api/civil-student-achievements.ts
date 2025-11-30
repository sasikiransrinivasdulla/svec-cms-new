import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { dept = 'civil' } = req.query as { dept?: string };

    try {
        const connection = await mysql.createConnection({
            host: '62.72.31.209',
            user: 'cmsuser',
            password: 'V@savi@2001',
            database: 'svec_cms',
        });

        const [rows] = await connection.execute(
            `SELECT * FROM civil_student_achievements
       ORDER BY id DESC`
        );

        await connection.end();

        // Group by category if it exists, otherwise return as array
        const grouped: Record<string, any[]> = {};
        (rows as any[]).forEach((r) => {
            const category = r.category || 'General';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(r);
        });

        res.status(200).json(grouped);
    } catch (error) {
        console.error('Error fetching Civil student achievements:', error);
        res.status(500).json({ error: 'Failed to fetch Civil student achievements' });
    }
}
