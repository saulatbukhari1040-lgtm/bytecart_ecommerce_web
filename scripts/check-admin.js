import { config } from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';

config();

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function checkAdmin() {
  try {
    // Get all users
    const users = await clerk.users.getUserList();
    console.log('\nUser Roles:');
    users.forEach(user => {
      const email = user.emailAddresses[0]?.emailAddress;
      const role = user.publicMetadata?.role || 'no role';
      console.log(`- ${email}: ${role}`);
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
  }
}

checkAdmin(); 