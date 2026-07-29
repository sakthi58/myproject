import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'

export default function FinalScene() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => { const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize) }, [])
  return <motion.div className="scene relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }}>
    <Confetti width={size.width} height={size.height} numberOfPieces={220} recycle={false} colors={['#D4577E', '#C9A15C', '#7F77DD', '#639922', '#F0997B']} />
    <motion.h1 className="font-display text-4xl md:text-5xl text-rose-600" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .2, type: 'spring' }}>Once Again Happy Birthday Jaiii 🎂</motion.h1>
    <p className="font-script text-2xl text-rose-500 mt-6">Made with love just for you</p><p className="tap-hint mt-4">with love Pooja</p>
  </motion.div>
}
