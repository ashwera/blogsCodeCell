import React from 'react'
import AsciiInfinity from './AsciiInfinity'
import { ArrowUpRight } from 'lucide-react'
import './Hero.css'

const Hero = ({ onBrowse }) => {
  return (
    <section className="hero-container">
      <div className="hero-content container">
        <h1 className="hero-heading">
          changing the <span className="hero-heading">world</span>
          <br />
          one <span className="italic" style={{ color: '#C1121F' }}>word</span>
          <br />
          at a time
        </h1>

        <button onClick={onBrowse} className="hero-cta">
          <span className="cta-icon">
            <ArrowUpRight size={16} />
          </span>
          View Blogs
        </button>
      </div>

      <AsciiInfinity />
    </section>
  )
}

export default Hero
