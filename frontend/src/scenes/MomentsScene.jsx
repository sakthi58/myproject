import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadPhoto, deletePhoto, isBackendConnected } from '../lib/api.js'

export default function MomentsScene({ wish, onNext, onUpdateWish }) {
  const [index, setIndex] = useState(0)
  const [showUploader, setShowUploader] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const photos = wish.photos || []
  const isLast = photos.length === 0 || index >= photos.length - 1

  const swipe = () => {
    if (isLast) {
      onNext()
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const updatedWish = await uploadPhoto(wish.slug, file, caption)
      onUpdateWish?.(updatedWish)
      setIndex(updatedWish.photos.length - 1)
      setShowUploader(false)
      setFile(null)
      setPreview(null)
      setCaption('')
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (photos.length === 0) return
    setUploading(true)
    setError(null)
    try {
      if (isBackendConnected) {
        const updatedWish = await deletePhoto(wish.slug, index)
        onUpdateWish?.(updatedWish)
        setIndex(Math.max(0, Math.min(index, updatedWish.photos.length - 1)))
      } else {
        const updatedPhotos = photos.filter((_, photoIndex) => photoIndex !== index)
        onUpdateWish?.({ ...wish, photos: updatedPhotos })
        setIndex(Math.max(0, Math.min(index, updatedPhotos.length - 1)))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-display text-3xl text-rose-600">Some Sweet Moments</h1>
      <p className="tap-hint mt-2">(Swipe the cards)</p>

      <div className="relative mt-10 h-[420px] w-[280px]">
        {photos.length === 0 && (
          <div className="absolute inset-0 rounded-2xl bg-cream shadow-card border border-dashed border-rose-400/30 flex flex-col items-center justify-center gap-2 p-6">
            <span className="text-4xl">📷</span>
            <p className="text-rose-500/70 text-sm">No photos yet — add the first one</p>
          </div>
        )}

        <AnimatePresence>
          {photos.slice(index, index + 2).reverse().map((photo, i) => {
            const isTop = i === photos.slice(index, index + 2).length - 1
            return (
              <motion.div
                key={photo.src + index + i}
                className="absolute inset-0 rounded-2xl bg-cream shadow-card border border-rose-400/10 p-3 flex flex-col cursor-grab active:cursor-grabbing"
                style={{ zIndex: isTop ? 2 : 1 }}
                initial={{ scale: 0.94, y: 10, opacity: 0 }}
                animate={{ scale: isTop ? 1 : 0.94, y: isTop ? 0 : 10, opacity: 1, rotate: isTop ? 0 : -3 }}
                exit={{ x: 400, opacity: 0, rotate: 15, transition: { duration: 0.35 } }}
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (isTop && Math.abs(info.offset.x) > 100) swipe()
                }}
              >
                <div className="flex-1 rounded-xl overflow-hidden bg-blush-200">
                  <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" draggable={false} />
                </div>
                {isTop && <button onClick={handleDelete} disabled={uploading} className="photo-delete" aria-label="Remove this photo">×</button>}
                <p className="font-script text-xl text-rose-600 mt-3">{photo.caption}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={swipe}
          className="rounded-full bg-rose-500 hover:bg-rose-600 text-cream font-medium px-8 py-3 shadow-card transition-colors"
        >
          {isLast ? 'Continue →' : 'Next'}
        </button>
        <button
          onClick={() => setShowUploader((s) => !s)}
          className="rounded-full bg-blush-200 hover:bg-blush-300 text-rose-700 font-medium w-12 h-12 flex items-center justify-center shadow-sm transition-colors text-xl"
          aria-label="Add a photo"
        >
          +
        </button>
      </div>
      {photos.length > 0 && <p className="tap-hint mt-3">{index + 1} / {photos.length}</p>}
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}

      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 w-full max-w-xs rounded-2xl bg-cream shadow-card border border-rose-400/10 p-5"
          >
            {!isBackendConnected ? (
              <p className="text-sm text-rose-500/80">
                Photo uploads need a backend connected. Set <code>VITE_API_URL</code> in{' '}
                <code>frontend/.env</code> — see the README's backend setup section.
              </p>
            ) : (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-rose-400/40 py-6 text-rose-500/70 text-sm hover:border-rose-400/70 transition-colors"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto max-h-32 rounded-lg object-cover" />
                  ) : (
                    'Tap to choose a photo'
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  className="w-full mt-3 rounded-xl border border-rose-300/50 px-3 py-2 text-sm text-rose-700 bg-white/70 outline-none focus:border-rose-400"
                />

                {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full mt-3 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-cream font-medium py-2.5 shadow-card transition-colors"
                >
                  {uploading ? 'Uploading…' : 'Upload photo'}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
