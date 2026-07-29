import React, { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { fetchWish } from './lib/api.js'

import PasscodeScene from './scenes/PasscodeScene.jsx'
import TeaserScene from './scenes/TeaserScene.jsx'
import RevealScene from './scenes/RevealScene.jsx'
import MomentsScene from './scenes/MomentsScene.jsx'
import MessageScene from './scenes/MessageScene.jsx'
import CandleScene from './scenes/CandleScene.jsx'
import FinalScene from './scenes/FinalScene.jsx'

const SCENES = ['passcode', 'teaser', 'reveal', 'moments', 'message', 'candle', 'final']

function Experience() {
  const { slug } = useParams()
  const [wish, setWish] = useState(null)
  const [sceneIndex, setSceneIndex] = useState(0)

  useEffect(() => {
    let mounted = true
    fetchWish(slug || 'sample').then((data) => {
      if (mounted) setWish(data)
    })
    return () => {
      mounted = false
    }
  }, [slug])

  if (!wish) {
    return (
      <div className="scene">
        <p className="font-script text-3xl text-rose-500">Wrapping your gift…</p>
      </div>
    )
  }

  const goNext = () => setSceneIndex((i) => Math.min(i + 1, SCENES.length - 1))
  const goBack = () => setSceneIndex((i) => Math.max(i - 1, 0))
  const scene = SCENES[sceneIndex]

  return (
    <div className="experience-shell">
      {sceneIndex > 0 && <button className="scene-back" onClick={goBack} aria-label="Go back to the previous page">←</button>}
      <AnimatePresence mode="wait">
      {scene === 'passcode' && <PasscodeScene key="passcode" wish={wish} onSuccess={goNext} />}
      {scene === 'teaser' && <TeaserScene key="teaser" wish={wish} onNext={goNext} />}
      {scene === 'reveal' && <RevealScene key="reveal" wish={wish} onNext={goNext} />}
      {scene === 'moments' && <MomentsScene key="moments" wish={wish} onNext={goNext} onUpdateWish={setWish} />}
      {scene === 'message' && <MessageScene key="message" wish={wish} onNext={goNext} onUpdateWish={setWish} />}
      {scene === 'candle' && <CandleScene key="candle" wish={wish} onNext={goNext} />}
      {scene === 'final' && <FinalScene key="final" wish={wish} />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Experience />} />
      <Route path="/:slug" element={<Experience />} />
    </Routes>
  )
}
