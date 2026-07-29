import fallbackWish from '../data/wishConfig.js'

// Set VITE_API_URL in frontend/.env (see .env.example) to point at your
// deployed backend, e.g. https://your-backend.onrender.com
const API_URL = import.meta.env.VITE_API_URL

export async function fetchWish(slug) {
  if (!API_URL || !slug) {
    return fallbackWish
  }

  try {
    const res = await fetch(`${API_URL}/api/wishes/${slug}`)
    if (!res.ok) throw new Error('Wish not found')
    const data = await res.json()
    return data
  } catch (err) {
    console.warn('Falling back to sample wish data:', err.message)
    return fallbackWish
  }
}

export async function createWish(payload) {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured')
  }
  const res = await fetch(`${API_URL}/api/wishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Could not create wish')
  return res.json()
}

// Uploads a photo file for a given wish. Returns the full, updated wish
// document (including the new photo) so the UI can refresh immediately.
export async function uploadPhoto(slug, file, caption) {
  if (!API_URL) {
    throw new Error('Photo uploads need a backend. Set VITE_API_URL in frontend/.env — see the README.')
  }
  const formData = new FormData()
  formData.append('photo', file)
  formData.append('caption', caption || '')

  const res = await fetch(`${API_URL}/api/wishes/${slug}/photos`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Upload failed')
  }
  return res.json()
}

export async function deletePhoto(slug, index) {
  if (!API_URL) {
    throw new Error('Photo management needs a backend. Set VITE_API_URL in frontend/.env.')
  }
  const res = await fetch(`${API_URL}/api/wishes/${slug}/photos/${index}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Could not delete photo')
  return res.json()
}

// Updates (or clears, with an empty string) the letter text.
// Returns the full, updated wish document.
export async function updateMessage(slug, message) {
  if (!API_URL) {
    throw new Error('Editing needs a backend. Set VITE_API_URL in frontend/.env — see the README.')
  }
  const res = await fetch(`${API_URL}/api/wishes/${slug}/message`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Could not save the message')
  }
  return res.json()
}

// Whether a backend is configured at all — used to show/hide upload UI.
export const isBackendConnected = Boolean(API_URL)
