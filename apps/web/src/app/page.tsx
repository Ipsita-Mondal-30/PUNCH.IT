import { LandingNavbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero';
import { MetricsSection } from '@/components/landing/metrics';
import { FeaturesSection } from '@/components/landing/features';
import { WorkflowSection } from '@/components/landing/workflow';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { PricingSection } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
