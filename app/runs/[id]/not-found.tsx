import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">💀</div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">Run Not Found</h1>
        <p className="text-gray-300 mb-8 max-w-md">
          This run has vanished into the void, just like the player who submitted it.
        </p>
        <div className="space-x-4">
          <Link
            href="/runs"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Browse All Runs
          </Link>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
