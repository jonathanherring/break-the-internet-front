import gifApi from './gif_api.js'
import test from 'ava'

test('gif_api:search', t => {
    return gifApi.search('cats')
    .then(video => {
        t.truthy(video.data.length >= 1)
    })
})