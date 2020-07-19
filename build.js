const Parser = require('rss-parser')
const parser = new Parser()

const Handlebars = require('handlebars')
const source = require('./template')
const template = Handlebars.compile(source)

const URL = 'https://qmacro.org/feed.xml'

const main = async _ => {
  try {
    const feed = await parser.parseURL(URL)
    const items = feed.items.map(item => {
      item.date = new Date(item.pubDate).toDateString()
      return item
    })
    console.log(template({items}))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()




