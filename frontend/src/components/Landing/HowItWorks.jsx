import React from 'react'
import { Link } from 'react-router-dom'

function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-green-50">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full mb-4">How It Works</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Movies with Ease</h2>
                    <p className="text-xl text-muted-foreground">
                        Three simple steps to start your personalized movie journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            number: "01",
                            title: "Set Your Preferences",
                            description: "Specify your movie preferences, genres, and interests to get tailored recommendations."
                        },
                        {
                            number: "02",
                            title: "Explore Movie Suggestions",
                            description: "Browse through movie recommendations based on your selected criteria, with detailed insights."
                        },
                        {
                            number: "03",
                            title: "Chat with the Movie Agent",
                            description: "Use our AI-powered agent to discuss your options, get more recommendations, and ask anything about movies."
                        }
                    ].map((step, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-white border shadow-md"
                        >
                            <div className="text-5xl font-bold text-green-200 mb-4">{step.number}</div>
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to='/explore_kb'>
                        <button className='px-8 py-4 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 rounded-lg text-lg'>
                            See It In Action
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
