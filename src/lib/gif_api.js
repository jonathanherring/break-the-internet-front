const fetch = require('isomorphic-fetch')
const _ = require('lodash')

const API_KEY = "6vOh5xCwnuGgudvaMLAMe9pmFit8B6Jh"
const API_LIMIT = "limit=5"
const API_URL = `https://api.giphy.com/v1/gifs/search?&api_key=${API_KEY}&${API_LIMIT}`

const search = (term) => {
    return fetch(API_URL + `&q=${term}`)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
      return json
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }

  // module.exports = {search: _.debounce(search, 300)}
module.exports = {search}
