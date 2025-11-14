const mysql = require('mysql2/promise');

const nonTeachingFaculty = [
  { name: "Mr.M.V.V.Satyanarayana", designation: "Lab Tech." },
  { name: "Mr.Sk.Mastan Vali(Shabbir)", designation: "Lab Tech." },
  { name: "Mr.Y.Narasimha Rao", designation: "Lab Tech." },
  { name: "Mr.G.Jani Babu", designation: "Lab Tech." },
  { name: "Mr.M.Naga Kavya", designation: "Lab Tech." },
  { name: "Mr.P.Naresh", designation: "Lab Tech." },
  { name: "Mr.G.S.C.V.Padmakar", designation: "D.E.O" },
  { name: "Ms.G.Kalyani Durga", designation: "D.E.O" },
  { name: "Mr.M.Sai Naveen Kumar", designation: "Attender" },
  { name: "Mr.B.Srinivisa Rao", designation: "Attender" },
  { name: "Mr.L.Phani Pallavi", designation: "Attender" },
];

async function migrateECENTFacultyData() {
  const connection = await mysql.createConnection({
    host: '62.72.31.209',
    user: 'cmsuser',
    password: 'V@savi@2001',
    database: 'svec_cms'
  });

  try {
    console.log('🔌 Connected to database');
    console.log('🏗️  Starting ECE Non-Teaching Faculty Migration...');

    // Create table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ece_nonteaching_faculty (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clear existing data (optional)
    const deleteResult = await connection.execute('DELETE FROM ece_nonteaching_faculty');
    console.log(`🗑️  Cleared ${deleteResult[0].affectedRows} existing non-teaching faculty records`);

    // Insert non-teaching faculty data
    let successCount = 0;
    let errorCount = 0;

    for (const member of nonTeachingFaculty) {
      try {
        await connection.execute(
          `INSERT INTO ece_nonteaching_faculty (name, designation, created_at) VALUES (?, ?, NOW())`,
          [member.name, member.designation]
        );
        console.log(`✅ Inserted: ${member.name} - ${member.designation}`);
        successCount++;
      } catch (error) {
        console.log(`❌ Error inserting ${member.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully inserted: ${successCount} non-teaching faculty members`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${nonTeachingFaculty.length}`);

    // Verify the data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM ece_ntfaculty');
    console.log(`📋 Total non-teaching faculty in database: ${rows[0].count}`);

  } catch (error) {
    console.error('💥 Migration failed:', error.message);
  } finally {
    await connection.end();
    console.log('🔐 Database connection closed');
  }
}

// Run the migration
if (require.main === module) {
  migrateECENTFacultyData()
    .then(() => {
      console.log('🎉 ECE Non-Teaching Faculty migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateECENTFacultyData, nonTeachingFaculty };