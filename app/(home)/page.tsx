import { FeaturesSection } from './components/features';
import HeroSection from './components/hero';
import CallToAction from './components/cta';

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className='max-w-7xl mx-auto'>
        <FeaturesSection />

        {/* Community CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-8 md:p-12 shadow-sm">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 tracking-tight">
                Join the Z-Learn Community
              </h2>
              <p className="mt-3 text-emerald-800/90 text-base md:text-lg">
                Learn together, faster. Share your progress, get answers in minutes, join study groups, and keep your streaks alive — all in one welcoming space built for growth.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/community"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700 transition-colors"
                >
                  Explore Community
                </a>
                <a
                  href="/community/qa"
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-300 text-emerald-800 px-6 py-3 font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Ask a Question
                </a>
              </div>
            </div>

            {/* Decorative */}
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-emerald-200/60 blur-2xl" />
          </div>
        </section>

        <CallToAction />
      </div>
    </>
  );
}