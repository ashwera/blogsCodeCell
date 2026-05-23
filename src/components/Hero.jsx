import React, { useEffect, useState } from 'react'
import AsciiInfinity from './AsciiInfinity'
import { ArrowUpRight } from 'lucide-react'
import './Hero.css'

const Hero = ({ onBrowse }) => {
  const [typedWord, setTypedWord] = useState('')

  useEffect(() => {
    const frames = [
      '',
      'B',
      'Bi',
      'Bit',
      'Bit',
      'Bit',
      'Bi',
      'B',
      '',
      'W',
      'Wo',
      'Wor',
      'Word',
      'Word',
      'Word',
    ]
    let frame = 0
    const interval = window.setInterval(() => {
      frame += 1
      setTypedWord(frames[frame])
      if (frame === frames.length - 1) {
        window.clearInterval(interval)
      }
    }, 320)

    setTypedWord(frames[0])

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="hero-container">
      <div className="hero-content container">
        <h1 className="hero-heading">
          <span className="hero-heading-line">Changing The World<span className="hero-punctuation">,</span></span>
          <span className="hero-heading-line">
            One <span className="hero-word">{typedWord}</span><span className="hero-after-word">At A Time<span className="hero-punctuation">.</span></span>
          </span>
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
