import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">👻</div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">Page Not Found</h1>
        <p className="text-gray-300 mb-8 max-w-md">
          You&apos;ve wandered into the void. Even the darkness doesn&apos;t know where you are.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/runs"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Runs
          </Link>
        </div>
      </div>
    </div>
  );
}
