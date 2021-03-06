'use strict'

const errcode = require('err-code')
const uint8ArrayToString = require('uint8arrays/to-string')
const uint8ArrayFromString = require('uint8arrays/from-string')

const namespace = '/record/'

module.exports.encodeBase32 = (buf) => {
  return uint8ArrayToString(buf, 'base32')
}

// converts a binary record key to a pubsub topic key.
module.exports.keyToTopic = (key) => {
  // Record-store keys are arbitrary binary. However, pubsub requires UTF-8 string topic IDs
  // Encodes to "/record/base64url(key)"
  if (typeof key === 'string' || key instanceof String) {
    key = uint8ArrayFromString(key)
  }

  const b64url = uint8ArrayToString(key, 'base64url')

  return `${namespace}${b64url}`
}

// converts a pubsub topic key to a binary record key.
module.exports.topicToKey = (topic) => {
  if (topic.substring(0, namespace.length) !== namespace) {
    throw errcode(new Error('topic received is not from a record'), 'ERR_TOPIC_IS_NOT_FROM_RECORD_NAMESPACE')
  }

  const key = topic.substring(namespace.length)

  return uint8ArrayFromString(key, 'base64url')
}
