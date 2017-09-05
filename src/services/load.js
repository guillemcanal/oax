import yaml from 'yaml-js'

const axios = require('axios')
// const schemaBundler = require('json-schema-bundler')
const schemaBundler = require('../../vendor/json-schema-bundler/src/schema')
const compactJSON = require('json-stringify-pretty-compact')

const cache = {}

export default function load (url, progress = null) {
  return new Promise((resolve, reject) => {
    const schema = new schemaBundler.Schema(url, progress, yaml.load, axios.get)
    schema.cache = cache
    schema.load().then(() => {
      try {
        progress({text: 'bundle', section: 'Schema', loaded: 0, total: 1})
        schema.bundle()
        schema.json = compactJSON(schema.bundled)
        progress({text: 'dereference', section: 'Schema', loaded: 1, total: 1})
        schema.deref()
        resolve(schema)
      } catch (err) {
        reject(err)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
