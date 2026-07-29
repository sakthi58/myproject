import mongoose from 'mongoose'

const PhotoSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    caption: { type: String, default: '' }
  },
  { _id: false }
)

const WishSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    recipientName: { type: String, required: true },
    senderName: { type: String, default: '' },
    passcode: { type: String, required: true },
    passcodeHint: { type: String, default: '' },
    teaser: {
      question: { type: String, default: 'I made something special for u, do u wanna see it?' },
      nudgeText: { type: String, default: 'Why did u click no!?' },
      nudgeButton: { type: String, default: 'Try again' }
    },
    reveal: {
      heading: { type: String, default: "Oh, it's your birthday today!" },
      buttonText: { type: String, default: 'Yes' }
    },
    photos: { type: [PhotoSchema], default: [] },
    message: { type: String, required: true },
    closingNote: { type: String, default: 'Made with love, just for you.' }
  },
  { timestamps: true }
)

export default mongoose.model('Wish', WishSchema)
