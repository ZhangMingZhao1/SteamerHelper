const rsa = require('node-rsa')

function make_sign(post_data, APPSECRET) {
    const keys = []
    const post_list = []
    for (let i in post_data) {
        keys.push(i)
    }
    keys.sort()
    for (let key of keys) {
        post_list.push(`${key}=${encodeURIComponent(post_data[key])}`)
        // 转义数字必须大写
    }
    const sign = `${post_list.join("&")}${APPSECRET}`
    return sign
}

function make_rsa(text, pubkey) {
    let key = new rsa(pubkey)
    key.setOptions({
        encryptionScheme: 'pkcs1'
    })
    const encrypted = key.encrypt(text, 'base64')
    return encrypted
}
module.exports = {
    make_sign,
    make_rsa
}