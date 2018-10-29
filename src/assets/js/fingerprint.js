const fingerprintjs2 = require('fingerprintjs2')

const calcFingerprint = () => {
  return new Promise((resolve, reject) => {
    fingerprintjs2.getV18({ fonts: { extendedJsFonts: true } }, (result) => {
      resolve(result)
    })
  })
}

// 取得瀏覽器指紋(hash)
const get = () => {
  return new Promise((resolve, reject) => {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        calcFingerprint().then(result => resolve(result))
      })
    } else {
      setTimeout(() => {
        calcFingerprint().then(result => resolve(result))
      }, 500)
    }
  })
}

export default {
  get
}
