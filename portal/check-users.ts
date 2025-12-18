import { db } from './lib/db';
import { users } from './lib/db/schema/users';
import bcrypt from 'bcryptjs';

async function main() {
  const allUsers = await db.select().from(users);
  console.log('Users in database:');
  for (const u of allUsers) {
    console.log(`- ${u.email} (${u.userType})`);
    // テスト: password123でverify
    const valid = await bcrypt.compare('password123', u.passwordHash);
    console.log(`  password123 valid: ${valid}`);
  }
}
main();
