/**
 * Home Page
 * Redirects to dashboard if authenticated, otherwise to login
 * Server Component
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app/dashboard');
  } else {
    redirect('/auth/login');
  }
}
