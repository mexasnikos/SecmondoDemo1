const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing PostgreSQL connection...');
console.log('DB Config:', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'travel_insurance',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD ? '***hidden***' : 'no password set'
});

const passwords = ['postgres', 'password', 'admin', '123456', '', 'root'];

async function testPassword(password) {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres db first
    password: password,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const client = await pool.connect();
    console.log(`✅ SUCCESS: Connected with password: "${password || 'empty'}"`);
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ FAILED: Password "${password || 'empty'}" - ${error.message}`);
    await pool.end();
    return false;
  }
}

async function findWorkingPassword() {
  for (const password of passwords) {
    const success = await testPassword(password);
    if (success) {
      console.log(`\n🎉 Found working password: "${password || 'empty'}"`);
      console.log(`Update your .env file with: DB_PASSWORD=${password}`);
      return;
    }
  }
  console.log('\n❌ No working password found. PostgreSQL might not be running or needs manual setup.');
}

findWorkingPassword();
