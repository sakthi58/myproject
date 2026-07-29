import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateMessage, isBackendConnected } from '../lib/api.js'

export default function MessageScene({ wish, onNext, onUpdateWish }) {
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(wish.message || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const startEditing = () => { setDraft(wish.message || ''); setError(null); setEditing(true) }
  const handleSave = async () => {
    setSaving(true); setError(null)
    try { const updatedWish = await updateMessage(wish.slug, draft); onUpdateWish?.(updatedWish); setEditing(false) }
    catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  const handleClear = async () => {
    setSaving(true); setError(null)
    try { const updatedWish = await updateMessage(wish.slug, ''); onUpdateWish?.(updatedWish); setDraft(''); setEditing(false) }
    catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <motion.div className="scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>
      <h1 className="wish-title font-display text-3xl md:text-4xl mb-2">A Special Message Just for you</h1>
      <p className="tap-hint mb-8">A note, just for you</p>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button key="postcard" onClick={() => setOpened(true)} initial={{ opacity: 0, y: 22, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} exit={{ opacity: 0, scale: 1.06 }} whileHover={{ y: -8, rotate: 0 }} whileTap={{ scale: .98 }} className="postcard" aria-label="Open your birthday letter">
            <div className="postcard-paper">
              <div className="postcard-stamp"><span>FOR</span><strong>{wish.recipientName?.slice(0, 1) || 'U'}</strong><span>YOU</span></div>
              <div className="postcard-address">
                <span className="postcard-label">delivered with love</span>
                <span className="postcard-name">To {wish.recipientName}</span>
                <i /> <i /> <i />
              </div>
              <div className="postcard-divider" />
              <div className="postcard-message">I saved something special<br />for your birthday.</div>
              <div className="postcard-airmail">✦ HAPPY MAIL ✦</div>
            </div>
            <div className="envelope">
              <div className="envelope-back" />
              <div className="envelope-left" /><div className="envelope-right" />
              <div className="envelope-flap" />
              <div className="wax-seal">♥</div>
            </div>
            <span className="postcard-hint">Tap the seal to open</span>
          </motion.button>
        ) : (
          <motion.article key="letter" initial={{ opacity: 0, y: 30, scale: .92, rotateX: -12 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 110, damping: 15 }} className="letter-paper">
            <div className="letter-corner letter-corner--one">✦</div><div className="letter-corner letter-corner--two">✦</div>
            <div className="letter-heading"><span>Dear</span><strong>{wish.recipientName},</strong></div>
            {!editing && <button onClick={startEditing} className="letter-edit">Edit note</button>}
            {editing ? (
              !isBackendConnected ? <p className="text-sm text-rose-500/80">Editing needs a backend connection. Set <code>VITE_API_URL</code> in <code>frontend/.env</code>.</p> : <>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={8} placeholder="Write your message here..." className="letter-textarea" />
                {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
                <div className="flex gap-2 mt-4"><button onClick={handleSave} disabled={saving} className="wish-button flex-1 rounded-full font-medium py-2.5 disabled:opacity-50">{saving ? 'Saving...' : 'Save note'}</button><button onClick={() => setEditing(false)} disabled={saving} className="wish-button-soft rounded-full font-medium px-5 py-2.5">Cancel</button></div>
                <button onClick={handleClear} disabled={saving} className="letter-edit mt-3">Clear note</button>
              </> 
            ) : <>
              <div className="letter-rule" />
              {wish.message ? <p className="letter-content">{wish.message}</p> : <p className="letter-content italic opacity-60">No message yet — tap Edit note to write one.</p>}
              <div className="letter-signoff">with all my love <span>♥</span>, Pooja</div>
              <button onClick={onNext} className="wish-button mt-6 w-full rounded-full font-medium py-3 transition-colors">Continue →</button>
            </>}
          </motion.article>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
