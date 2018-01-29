importScripts( 'workbox.js' )
importScripts( 'workbox-ga.js' )

const workboxSW = new self.WorkboxSW()

workbox.googleAnalytics.initialize()

workboxSW.precache([
  {
    "url": "docs.min.css",
    "revision": "fe7450ab426d113ec29220d5d363c189"
  },
  {
    "url": "docs.min.js",
    "revision": "864370352370397e367cae38816f0430"
  },
  {
    "url": "sw.js",
    "revision": "c0cfd5ca5afbf53595a01e536095b803"
  },
  {
    "url": "workbox-ga.js",
    "revision": "af318c3ed49864e17dd54990b0bd8598"
  },
  {
    "url": "workbox.js",
    "revision": "c078f168ee13cf974bd011130a93faf3"
  }
])
