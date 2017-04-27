'use strict'

const crypto = require('crypto')

const utils = {
  normalize,
  encrypt,
  cleanVar
}

function normalize (text) {
  text = text.toLowerCase()
  return text
}

function cleanVar (text) {
  if (text == null) return []

  let matches = text.match(/\w+/g)

  if (matches === null) return []

  return matches
}

function encrypt (password) {
  let shasum = crypto.createHash('sha256')
  shasum.update(password)
  return shasum.digest('hex')
}

module.exports = utils
