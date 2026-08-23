import FeaturesSection from "../components/FeaturesSection"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import LandingTopbar from "../components/LandingTopbar"
import WorkflowSection from "../components/WorkflowSection"

const LandingPage = () => (
  <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <LandingTopbar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
    </main>
    <Footer />
  </div>
)

export default LandingPage
