import cheerio from 'cheerio'
import optimizeImages from '../../src/utils/optimizeImages'

describe('optimizeImages', () => {
  it('should transform image src to come from our optimizer', async () => {
    const $ = cheerio.load(`
    <div>
      <img src="http://placekitten.com/200/300">
    </div>
    `)
    optimizeImages($('img'))
    expect($.html({ decodeEntities: false })).toEqual(`
    <div>
      <img src="https://opt.moovweb.net/?quality=75&img=http%3A%2F%2Fplacekitten.com%2F200%2F300">
    </div>
    `)
  })
  it('should transform multiple images with given quality', async () => {
    const $ = cheerio.load(`
    <div>
      <img src="http://placekitten.com/200/300">
      <img src="http://placekitten.com/500">
    </div>
    `)
    optimizeImages($('img'), { quality: 50 })
    expect($.html({ decodeEntities: false })).toEqual(`
    <div>
      <img src="https://opt.moovweb.net/?quality=50&img=http%3A%2F%2Fplacekitten.com%2F200%2F300">
      <img src="https://opt.moovweb.net/?quality=50&img=http%3A%2F%2Fplacekitten.com%2F500">
    </div>
    `)
  })
  it('should be able to select specific images to transform', async () => {
    const $ = cheerio.load(`
    <div>
      <img src="http://placekitten.com/200/300">
      <img class="test" src="http://placekitten.com/500">
      <img src="http://placekitten.com/400">
    </div>
    `)
    optimizeImages($('.test'), { quality: 50 })
    expect($.html({ decodeEntities: false })).toEqual(`
    <div>
      <img src="http://placekitten.com/200/300">
      <img class="test" src="https://opt.moovweb.net/?quality=50&img=http%3A%2F%2Fplacekitten.com%2F500">
      <img src="http://placekitten.com/400">
    </div>
    `)
  })
})
