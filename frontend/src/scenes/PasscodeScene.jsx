import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

function HeartKey({ label, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} className="heart-key" style={disabled ? { visibility: 'hidden' } : undefined} aria-label={`key ${label}`}><svg viewBox="0 0 100 92" className="heart-key__svg"><path d="M50,90 C50,90 4,54 4,24 C4,4 24,-4 50,17 C76,-4 96,4 96,24 C96,54 50,90 50,90 Z" /></svg><span className="heart-key__label">{label}</span></button>
}

const SPARKLES = [{ top: '8%', left: '4%', size: 10, dur: 5.5, delay: 0 }, { top: '15%', left: '92%', size: 14, dur: 6.5, delay: .6 }, { top: '70%', left: '2%', size: 8, dur: 5, delay: 1.2 }, { top: '80%', left: '90%', size: 12, dur: 7, delay: .3 }]
function Sparkle({ top, left, size, dur, delay }) { return <motion.svg viewBox="0 0 24 24" className="sparkle" style={{ top, left, width: size, height: size }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, .4, 1, 0], y: [0, -10, -4, -14, 0], x: [0, 4, -3, 5, 0], rotate: [0, 15, -10, 20, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}><path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="#FFFFFF" /></motion.svg> }

function Teddy() {
  return <svg viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" aria-label="Cute teddy bear">
    <ellipse cx="140" cy="278" rx="76" ry="16" fill="#ad6170" opacity=".2"/><ellipse cx="88" cy="86" rx="38" ry="38" fill="#c99168" stroke="#754837" strokeWidth="3"/><ellipse cx="192" cy="86" rx="38" ry="38" fill="#c99168" stroke="#754837" strokeWidth="3"/>
    <ellipse cx="140" cy="132" rx="83" ry="76" fill="#d7a27b" stroke="#754837" strokeWidth="3"/><ellipse cx="140" cy="220" rx="86" ry="72" fill="#c99168" stroke="#754837" strokeWidth="3"/><ellipse cx="140" cy="228" rx="47" ry="43" fill="#f2d4bd"/>
    <ellipse cx="91" cy="237" rx="27" ry="22" fill="#d7a27b" stroke="#754837" strokeWidth="3" transform="rotate(-22 91 237)"/><ellipse cx="189" cy="237" rx="27" ry="22" fill="#d7a27b" stroke="#754837" strokeWidth="3" transform="rotate(22 189 237)"/>
    <ellipse cx="106" cy="124" rx="10" ry="13" fill="#38231f"/><ellipse cx="174" cy="124" rx="10" ry="13" fill="#38231f"/><circle cx="109" cy="120" r="3" fill="#fff"/><circle cx="177" cy="120" r="3" fill="#fff"/><ellipse cx="140" cy="151" rx="35" ry="27" fill="#f5d9c3"/><ellipse cx="140" cy="144" rx="9" ry="7" fill="#5d352f"/><path d="M140 151q-12 14-24 0M140 151q12 14 24 0" fill="none" stroke="#5d352f" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="90" cy="151" r="12" fill="#e9939f" opacity=".65"/><circle cx="190" cy="151" r="12" fill="#e9939f" opacity=".65"/><path d="M140 193l11 17 20 3-15 14 4 20-20-10-20 10 4-20-15-14 20-3z" fill="#f3a7b6" stroke="#a65368" strokeWidth="2"/><path d="M140 206v25M128 218h24" stroke="#fff3f5" strokeWidth="3" strokeLinecap="round"/>
  </svg>
}

export default function PasscodeScene({ wish, onSuccess }) {
  const safeWish = wish || { passcode: '0000', passcodeHint: '', recipientName: 'someone' }
  const length = (safeWish.passcode || '0000').length
  const [entered, setEntered] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const submit = (code) => { if (code === safeWish.passcode) onSuccess?.(); else { setShake(true); setTimeout(() => { setShake(false); setEntered('') }, 500) } }
  const handleKey = (key) => { if (key === '*' || key === '#' || entered.length >= length) return; const next = entered + key; setEntered(next); if (next.length === length) setTimeout(() => submit(next), 200) }
  const hint = (safeWish.passcodeHint || 'No hint available').replace(/^hint:\s*/i, '')

  return <motion.div className="scene passcode-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>
    <div className="passcode-glow" /><div className="passcode-hearts">♥ ♥ ♥</div>
    <div className="passcode-content"><motion.div className="bunny-figure" initial={{ opacity: 0, y: 40, scale: .85 }} animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }} transition={{ opacity: { duration: .7 }, scale: { duration: .7 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: .7 } }}>{SPARKLES.map((s, i) => <Sparkle key={i} {...s} />)}<img className="bunny-image" src="/assets/bunny-wave.png" alt="Cute bunny waving" /></motion.div>
      <motion.div className="passcode-card" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }}><h1 className="passcode-title">Enter a passcode</h1><motion.div className="passcode-boxes" animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}} transition={{ duration: .4 }}>{Array.from({ length }).map((_, i) => <div key={i} className={`passcode-box ${i < entered.length ? 'passcode-box--filled' : ''}`}>{i < entered.length ? '•' : ''}</div>)}</motion.div><div className="heart-keypad">{KEYS.map((key, i) => <HeartKey key={i} label={key} disabled={key === '*' || key === '#'} onClick={() => handleKey(key)} />)}</div><button onClick={() => { if (entered.length === length) submit(entered) }} className="passcode-next">Next</button><button onClick={() => setShowHint(true)} className="hint-trigger" aria-label="Show passcode hint">💡 <span>Need a hint?</span></button></motion.div>
    </div><AnimatePresence>{showHint && <motion.div className="hint-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHint(false)}><motion.div className="hint-modal" initial={{ scale: .85, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, y: 12 }} onClick={(event) => event.stopPropagation()}><div className="hint-envelope">💌</div><h2>Hint</h2><p>{hint}</p><button onClick={() => setShowHint(false)}>Got it!</button></motion.div></motion.div>}</AnimatePresence>
  </motion.div>
}
