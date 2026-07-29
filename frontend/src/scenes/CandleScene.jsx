import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CandleScene({ wish, onNext }) {
  const [blownOut, setBlownOut] = useState(false)

  const handleBlow = () => {
    if (blownOut) return
    setBlownOut(true)
    setTimeout(onNext, 1400)
  }

  return (
    <motion.div className="scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="wish-title font-display text-3xl md:text-4xl mb-7">Make a wish {wish.recipientName}</h1>

      <div className="candle-stage">
        <button onClick={handleBlow} className="focus:outline-none" aria-label="Blow out the candle">
          <svg viewBox="0 0 360 390" className="candle-cake" role="img" aria-label="A birthday cake with one candle">
            <defs>
              <linearGradient id="plate" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fdfefe"/><stop offset="1" stopColor="#b9c8df"/></linearGradient>
              <linearGradient id="cake" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#f5c1c7"/><stop offset="1" stopColor="#c76f7b"/></linearGradient>
              <linearGradient id="icing" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fff8f2"/><stop offset="1" stopColor="#f0d9d5"/></linearGradient>
              <linearGradient id="candle" x1="0" x2="1"><stop stopColor="#879fc2"/><stop offset=".48" stopColor="#f1f5ff"/><stop offset="1" stopColor="#7390b8"/></linearGradient>
              <radialGradient id="flame"><stop stopColor="#fff9b4"/><stop offset=".48" stopColor="#ffc65f"/><stop offset="1" stopColor="#e87945"/></radialGradient>
            </defs>
            <ellipse className="cake-glow" cx="180" cy="334" rx="130" ry="21" fill="#69799a" opacity=".22"/>
            <g className="cake-plate"><ellipse cx="180" cy="320" rx="143" ry="35" fill="url(#plate)"/><ellipse cx="180" cy="311" rx="132" ry="27" fill="#f9fcff" stroke="#aabbd3" strokeWidth="2"/></g>
            <path d="M72 238 Q180 218 288 238 L275 307 Q180 334 85 307Z" fill="url(#cake)" stroke="#aa5969" strokeWidth="2"/>
            <path d="M74 239 Q180 263 286 239" fill="none" stroke="#f7d0d0" strokeWidth="3" opacity=".65"/>
            <ellipse cx="180" cy="235" rx="108" ry="35" fill="url(#icing)" stroke="#d6a4aa" strokeWidth="2"/>
            <path d="M82 238 C92 274 108 245 120 259 C130 278 145 246 157 261 C170 280 188 246 202 261 C217 278 232 247 245 258 C257 272 270 248 278 238" fill="#fff7f2" stroke="#e8c5c7" strokeWidth="2"/>
            {[105, 137, 169, 203, 236].map((x, i) => <circle key={x} cx={x} cy={226 + (i % 2) * 5} r="5" fill={["#e97d8d", "#8ba4c8", "#e9ad62"][i % 3]}/>) }
            <g transform="translate(0 -2)"><rect x="165" y="102" width="30" height="111" rx="5" fill="url(#candle)" stroke="#6f89ad" strokeWidth="2"/><path d="M171 109V207M181 105V210M191 108V207" stroke="#fff" strokeWidth="3" opacity=".75"/><rect x="178" y="91" width="4" height="14" rx="2" fill="#334057"/>
              {!blownOut ? <><ellipse className="candle-glow" cx="180" cy="66" rx="31" ry="41" fill="#ffd980" opacity=".22"/><motion.path d="M180 92 C154 74 164 42 180 24 C197 45 208 72 180 92Z" fill="url(#flame)" style={{ transformOrigin: '180px 92px' }} animate={{ scaleY: [1, 1.12, .94, 1], rotate: [-2, 2, -1] }} transition={{ repeat: Infinity, duration: .85 }}/><path d="M180 82 C172 70 177 57 182 50 C191 68 189 78 180 82Z" fill="#fff8bc" opacity=".9"/></> : <motion.g initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -45, x: 15 }} transition={{ duration: 1.25 }}><path d="M179 93 C161 78 194 73 178 57 C161 42 195 35 182 16" stroke="#95a0ac" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".7"/><path d="M187 88 C205 73 184 63 201 48" stroke="#b5bdc5" strokeWidth="3" fill="none" strokeLinecap="round"/></motion.g>}
            </g>
          </svg>
        </button>
      </div>
      <p className="tap-hint mt-6">{blownOut ? 'Wish sent — something lovely is coming…' : 'Tap the flame when you are ready'}</p>
    </motion.div>
  )
}
