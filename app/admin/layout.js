import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function AdminLayout({ children }) {
  const { userId } = auth();
  const user = await currentUser();
  
  // Check if user is authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-indigo-600">
                  Product Management
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 