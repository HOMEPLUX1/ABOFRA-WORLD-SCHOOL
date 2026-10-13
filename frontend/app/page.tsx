import TickerBar from '@/components/TickerBar'
import Hero from '@/components/Hero'
import WelcomeBanner from '@/components/WelcomeBanner'
import FeatureCards from '@/components/FeatureCards'
import NewsSection from '@/components/NewsSection'
export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBar />
      <WelcomeBanner />
      <FeatureCards />
      <NewsSection />
    </>
  )
}
