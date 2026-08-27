import Header from '../components/Header'
import Hero from '../sections/Hero'
import Cause from '../sections/Cause'
import HairDonation from '../sections/HairDonation'
import About from '../sections/About'
import Routes from '../sections/Routes'
import Categories from '../sections/Categories'
import CTA, { Footer } from '../sections/CTA'

export default function Landing() {
  return (
    <main>
      <Header />
      <Hero />
      <Cause />
      <HairDonation />
      <About />
      <Routes />
      <Categories />
      <CTA />
      <Footer />
    </main>
  )
}
