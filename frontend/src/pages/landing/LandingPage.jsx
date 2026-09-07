import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import FeaturedProducts from './FeaturedProducts';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

/**
 * Landing Page
 * Shared project component — assembles all storefront sections.
 * Route: /
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <AboutSection />
      <ContactSection />
    </>
  );
}
