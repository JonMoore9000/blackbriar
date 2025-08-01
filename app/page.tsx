import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page min-h-screen ">
      <div className="home-container container mx-auto px-4 py-8">
        <header className="home-header text-center mb-12">
          <h1 className="home-title font-header text-6xl font-bold text-red-500 mb-4 tracking-wider">
            WE ARE LOSING
          </h1>
          <p className="home-subtitle font-header text-xl text-gray-300 mb-8">
            Death Journal & Run Log
          </p>
          <p className="home-description font-body text-gray-400 max-w-2xl mx-auto">
            Share your runs, get roasted by AI, and see how others met their doom in the depths of terror.
          </p>
        </header>

        <div className="home-actions flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            href="/submit"
            className="home-submit-btn bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Submit Your Run
          </Link>
          <Link
            href="/runs"
            className="home-browse-btn bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Browse All Runs
          </Link>
        </div>

        <div className="home-features grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="home-feature-card home-feature-track bg-black/95 backdrop-blur-md p-6 rounded-lg border border-red-900/50">
            <h3 className="home-feature-title font-header text-xl font-bold text-red-400 mb-3">📊 Track Your Runs</h3>
            <p className="home-feature-description font-body text-gray-300">
              Log your boss fights, items, stats, and how you met your inevitable doom.
            </p>
          </div>
          <div className="home-feature-card home-feature-roast bg-black/95 backdrop-blur-md p-6 rounded-lg border border-red-900/50">
            <h3 className="home-feature-title font-header text-xl font-bold text-red-400 mb-3">🤖 Get Roasted</h3>
            <p className="home-feature-description font-body text-gray-300">
              Our AI will deliver brutal but hilarious commentary on your failures.
            </p>
          </div>
          <div className="home-feature-card home-feature-community bg-black/95 backdrop-blur-md p-6 rounded-lg border border-red-900/50">
            <h3 className="home-feature-title font-header text-xl font-bold text-red-400 mb-3">💬 Community</h3>
            <p className="home-feature-description font-body text-gray-300">
              Share your runs and comment on others&apos; spectacular defeats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
