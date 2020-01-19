import cookies from 'js-cookie'
const randomstring = require('randomstring')


// 取得玩家 id，若不存在則創建一個
const get = async () => {
  const id = cookies.get('userId') || randomstring.generate(16)
  cookies.set('userId', id, { expires: 365 })

  return id
}

export default {
  get,
}
