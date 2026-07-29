import { Router } from 'express'
import multer from 'multer'
import streamifier from 'streamifier'
import Wish from '../models/Wish.js'
import cloudinary from '../lib/cloudinary.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB per photo
})

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'birthday-wishes' },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

// GET /api/wishes/:slug - fetch a single wish by its shareable slug
router.get('/:slug', async (req, res) => {
  try {
    const wish = await Wish.findOne({ slug: req.params.slug.toLowerCase() })
    if (!wish) return res.status(404).json({ error: 'Wish not found' })
    res.json(wish)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/wishes - create a new personalized wish, returns its slug/link
router.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.recipientName || !body.message || !body.passcode) {
      return res.status(400).json({ error: 'recipientName, message and passcode are required' })
    }

    let slug = body.slug ? slugify(body.slug) : slugify(`${body.recipientName}-${Date.now().toString(36)}`)

    const existing = await Wish.findOne({ slug })
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
    }

    const wish = await Wish.create({ ...body, slug })
    res.status(201).json(wish)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/wishes/:slug/photos - upload a photo (multipart/form-data,
// field name "photo", optional "caption" field). Stores the image on
// Cloudinary (persistent, globally accessible CDN) and appends it to the
// wish's photos array in MongoDB, so it shows up for anyone opening the
// link on any device, immediately.
router.post('/:slug/photos', upload.single('photo'), async (req, res) => {
  try {
    const wish = await Wish.findOne({ slug: req.params.slug.toLowerCase() })
    if (!wish) return res.status(404).json({ error: 'Wish not found' })
    if (!req.file) return res.status(400).json({ error: 'No photo file provided (field name "photo")' })

    const result = await uploadBufferToCloudinary(req.file.buffer)
    wish.photos.push({ src: result.secure_url, caption: req.body.caption || '' })
    await wish.save()

    res.status(201).json(wish)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// DELETE /api/wishes/:slug/photos/:index - remove a photo by its position
// in the photos array (0-based).
router.delete('/:slug/photos/:index', async (req, res) => {
  try {
    const wish = await Wish.findOne({ slug: req.params.slug.toLowerCase() })
    if (!wish) return res.status(404).json({ error: 'Wish not found' })

    const idx = parseInt(req.params.index, 10)
    if (Number.isNaN(idx) || idx < 0 || idx >= wish.photos.length) {
      return res.status(400).json({ error: 'Invalid photo index' })
    }

    wish.photos.splice(idx, 1)
    await wish.save()
    res.json(wish)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/wishes/:slug/message - update (or clear) the letter text.
// Send { "message": "..." } — an empty string clears it. Saved centrally
// in MongoDB, so the change shows up for anyone opening the link, on any
// device, immediately.
router.patch('/:slug/message', async (req, res) => {
  try {
    if (typeof req.body.message !== 'string') {
      return res.status(400).json({ error: '"message" must be a string (send "" to clear it)' })
    }

    const wish = await Wish.findOneAndUpdate(
      { slug: req.params.slug.toLowerCase() },
      { message: req.body.message },
      { new: true }
    )
    if (!wish) return res.status(404).json({ error: 'Wish not found' })

    res.json(wish)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
