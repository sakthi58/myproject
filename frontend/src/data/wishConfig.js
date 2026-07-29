// This is the fallback content used when no backend/slug is provided,
// and the template you edit to personalize a single wish quickly.
// When the backend is connected, this same shape is fetched from
// GET /api/wishes/:slug and overrides everything below.

const wishConfig = {
  slug: 'sample',
 recipientName: 'Jaiii',
  senderName: 'Pooja',
  passcode: '0308',
  passcodeHint: 'Neeyae Kandu pudii',

  teaser: {
    question: 'I made something special for u, do u wanna see it?',
    nudgeText: 'Why did u click no!?',
    nudgeButton: 'Try again'
  },

  reveal: {
    heading: "Oh, it's your birthday today!",
    buttonText: 'Yes'
  },

  // Starts empty — the Moments scene card count is fully driven by whatever
  // gets uploaded through the + button (or added here manually). No
  // placeholder photos ship by default.
  photos: [],

  closingNote: 'Made with love, just for you.'
}

export default wishConfig
