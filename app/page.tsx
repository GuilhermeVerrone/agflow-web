import {
  Header,
  HeroSection,
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  PricingSection,
  SocialProofSection,
  FAQSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <PricingSection />
        <SocialProofSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
