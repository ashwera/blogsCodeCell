import React from 'react'
import ButtonWithIconDemo from './ui/button-witn-icon'
import AsciiInfinity from './AsciiInfinity'
import './Hero.css'

const Hero = ({ onBrowse }) => {
  return (
    <section className="hero-container">

      <div className="hero-content container">
        <h1 className="hero-heading">
          changing the <span className="hero-heading">world</span>
          <br />
          one <span className="italic text-[#C1121F]">word</span>
          <br />
          at a time
        </h1>

        <div onClick={onBrowse} className="w-fit">
          <ButtonWithIconDemo />
        </div>
      </div>

      <AsciiInfinity />

    </section>
  )
}

export default Hero