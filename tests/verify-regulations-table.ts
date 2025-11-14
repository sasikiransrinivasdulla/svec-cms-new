/**
 * Quick verification script to check if regulations table exists
 * Run with: npx ts-node tests/verify-regulations-table.ts
 */
import { query, execute } from '@/lib/db';

async function verifyRegulationsTable() {
  try {
    console.log('🔍 Verifying regulations table...\n');

    // Check if table exists
    const tableExists = await query(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = 'svec_cms' AND TABLE_NAME = 'regulations'`
    );

    if (!tableExists || tableExists.length === 0) {
      console.log('❌ Regulations table does not exist!');
      console.log('\n📋 To create the table, run:');
      console.log('   mysql -h 62.72.31.209 -u cmsuser -p svec_cms < sql/create_regulations_table.sql');
      return false;
    }

    // Check table structure
    const structure = await query('DESCRIBE regulations');
    console.log('✅ Regulations table exists!\n');
    console.log('📊 Table structure:');
    console.table(structure);

    // Check indexes
    const indexes = await query('SHOW INDEX FROM regulations');
    console.log('\n🔑 Indexes:');
    console.table(indexes);

    // Try a sample insert (if allowed)
    try {
      const testResult = await execute(
        `INSERT INTO regulations (title, description, year, type, academic_year, effective_from, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Test Regulation', 'This is a test', '2024', 'B.Tech', '2024-2025', '2024-07-01', 'pending']
      );
      console.log('\n✅ Test insert successful! Insert ID:', testResult.insertId);

      // Clean up test data
      await execute('DELETE FROM regulations WHERE id = ?', [testResult.insertId]);
      console.log('🧹 Test data cleaned up.\n');
    } catch (err: any) {
      console.log('\n⚠️  Test insert failed:', err.message);
    }

    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

// Run verification
verifyRegulationsTable().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
