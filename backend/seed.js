import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'node:dns'
import Wish from './models/Wish.js'

dotenv.config()

// Fix for "querySrv ECONNREFUSED" on some Windows networks — Node's default
// DNS resolver sometimes fails to reach the SRV record even when the OS
// itself resolves fine. Forcing Node to use Google's DNS directly sidesteps
// whatever is intercepting/blocking the lookup at the network/OS level.
dns.setServers(['8.8.8.8', '8.8.4.4'])

const sample = {
  slug: 'sample',
  recipientName: 'Jaiii',
  senderName: 'Pooja',
  passcode: '0308',
  passcodeHint: 'hint: Neeyae Kandu Pudii',
  teaser: {
    question: 'I made something special for u, do u wanna see it?',
    nudgeText: 'Why did u click no!?',
    nudgeButton: 'Try again'
  },
  reveal: {
    heading: "Oh, it's your birthday today!",
    buttonText: 'Yes'
  },
  photos: [],
  message:
    "\nHappy birthday to someone truly special. Every year with you feels like a gift I didn't need to unwrap twice.\n\nHere's to more laughter, more stories and more years of us being exactly this ridiculous together.",
  closingNote: 'Made with love, just for you.'
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  await Wish.findOneAndUpdate({ slug: sample.slug }, sample, { upsert: true, new: true })
  console.log('Seeded sample wish at slug "sample"')
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
