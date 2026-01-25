'use server';

import { auth } from '@/lib/auth';

export async function signInUsernameAction(data: { username: string; password: string }) {
  return await auth.api.signInUsername({
    body: {
      username: data.username,
      password: data.password,
    },
  });
}

export async function signOutAction() {
  return await auth.api.signOut();
}
