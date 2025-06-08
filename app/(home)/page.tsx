import { FeaturesSection } from './components/features';
import HeroSection from './components/hero';
import CallToAction from './components/cta';

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className='max-w-7xl mx-auto'>
        <FeaturesSection />
        <CallToAction />
      </div>
    </>
  );
}