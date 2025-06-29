import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import HeroSection from '../components/Landing/HeroSection'
import Features from '../components/Landing/Features'
import HowItWorks from '../components/Landing/HowItWorks'
import Footer from '../components/Footer/Footer'

const LandingPage = () => {
  return (
    <div
    // style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}
    >
        <Navbar showMoreDetails={true}/>
        <HeroSection/>
        <Features/>
        <HowItWorks/>
        <Footer/>
        {/* <Technology/> */}
    </div>
  )
}

export default LandingPage