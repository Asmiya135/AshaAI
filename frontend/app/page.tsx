import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { GeneralChatbot } from "@/components/general-chatbot"
import { FeaturesSection } from "@/components/features-section"
import { EthicalAISection } from "@/components/ethical-ai-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white overflow-hidden">
      <AuroraBackground />
      <Navbar />
      <HeroSection />
      <GeneralChatbot />
      <FeaturesSection />
      <EthicalAISection />
      <HowItWorksSection />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
