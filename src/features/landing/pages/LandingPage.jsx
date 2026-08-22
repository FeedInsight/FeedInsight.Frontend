import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import LandingTopbar from "../components/LandingTopbar"

const LandingPage = () => (
  <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <LandingTopbar />
    <main>
      <HeroSection />
    </main>
    <Footer />
  </div>
)

export default LandingPage
