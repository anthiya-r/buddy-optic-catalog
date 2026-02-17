import 'dotenv/config';
import { auth } from '../lib/auth';

const ADMIN_USER = {
  name: 'Admin',
  email: 'admin@buddy-optic.com',
  username: 'admin',
  password: 'Admin@1234',
};

async function seed() {
  console.log('Seeding admin user...');

  try {
    // Check if user already exists
    const existingUser = await auth.api.getSession({
      headers: new Headers(),
    });

    // Use Better Auth's sign up API
    const result = await auth.api.signUpEmail({
      body: {
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
        username: ADMIN_USER.username,
      },
    });

    if (result.user) {
      console.log('Admin user created successfully!');
      console.log('Email:', ADMIN_USER.email);
      console.log('Username:', ADMIN_USER.username);
      console.log('Password:', ADMIN_USER.password);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('User already exists')) {
      console.log('Admin user already exists, skipping...');
    } else {
      console.error('Error seeding admin user:', error);
      process.exit(1);
    }
  }

  console.log('Seed completed!');
  process.exit(0);
}

seed();
