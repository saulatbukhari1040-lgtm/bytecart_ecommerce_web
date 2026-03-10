import { config } from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';
import readline from 'readline';

config();

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function setupAdmin() {
  try {
    // Get all users
    const users = await clerk.users.getUserList();
    console.log('Available users:');
    users.forEach(user => {
      console.log(`- ${user.emailAddresses[0]?.emailAddress} (${user.id})`);
    });

    // Ask for email
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter the email of the user to make admin: ', async (email) => {
      try {
        // Find user by email
        const user = users.find(u => 
          u.emailAddresses.some(e => e.emailAddress === email)
        );

        if (!user) {
          console.error('User not found');
          process.exit(1);
        }

        // Update user metadata to add admin role
        await clerk.users.updateUser(user.id, {
          publicMetadata: { role: 'admin' }
        });

        console.log(`Successfully set ${email} as admin`);
        process.exit(0);
      } catch (error) {
        console.error('Error updating user:', error);
        process.exit(1);
      } finally {
        rl.close();
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }
}

setupAdmin(); 