/* Site-wide settings — edit here only. */
window.SITE_CONFIG = {
  firm: "365 Wealth Management",
  phoneDisplay: "+91 99682 82769",
  phone: "+919968282769",
  whatsapp: "919968282769",
  email: "mrpankajmanchanda@gmail.com",
  arn: "364547",

  // Free key from https://web3forms.com — create it with mrpankajmanchanda@gmail.com
  // so that enquiries and chatbot escalations are delivered to that inbox.
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY",

  // Netlify Function that proxies the Claude API (see netlify/functions/chat.mjs)
  chatEndpoint: "/.netlify/functions/chat",
  chatMaxMessages: 30,
  chatMaxChars: 800,

  youtubeChannel: "" // e.g. "https://www.youtube.com/@365WealthManagement"
};
