import Header from '../components/Header'
import Hero from '../sections/Hero'
import Cause from '../sections/Cause'
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
      <About />
      <Routes />
      <Categories />
      <CTA />
      <Footer />
    </main>
  )
}
