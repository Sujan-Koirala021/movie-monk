import React from 'react'
import { Link } from 'react-router-dom'
import AnimatedButton from '../AnimatedButton'
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-screen pt-32 pb-16 px-4 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-green-300 rounded-full filter blur-3xl"></div>
      </div>
      <div className="container mx-auto max-w-7xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-800 mb-4">
                AI-Powered Movie Discovery
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                Discover your <span className="text-green-600">next favorite movie</span> with ease
              </h1>
              <p className="text-xl text-muted-foreground">
                MovieMonk helps you discover the best movies based on your personal preferences and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to='/explore_kb'>
                <button className=' px-8 py-4 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 rounded-lg text-lg font-bold'>
                  Start Discovering
                </button>
              </Link>
              <Link to='/chat_agent'>

                <button variant="outline" className="text-lg px-8 py-4 border border-green-200 text-green-600 hover:bg-green-200 rounded-lg font-bold">
                  <span className='flex justify-center items-center'>
                    Talk with MovieMonk <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                </button>
              </Link>

            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute z-0 -top-8 -right-8 w-64 h-64 rounded-xl rotate-3  bg-gradient-to-r from-green-200 to-green-700 opacity-60 animate-pulse"></div>

            <div className="relative z-10 bg-white p-6 rounded-xl shadow-2xl transform rotate-3 transition-all duration-500 hover:rotate-6 hover:scale-105 cursor-pointer">
              <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                <img
                  src='https://image.slidesdocs.com/responsive-images/background/colorful-movie-night-with-3d-glasses-popcorn-and-cinematic-clapperboard-powerpoint-background_c3011698e0__960_540.jpg'
                  alt="Movie discovery"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
                  loading="lazy"
                />
              </div>

              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white text-center rounded-full shadow-lg">
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 z-0 bg-green-100 w-full h-full rounded-2xl shadow-inner"></div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection
