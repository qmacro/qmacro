const Parser = require('rss-parser')
const parser = new Parser()

const Handlebars = require('handlebars')
const source = require('./template')
const template = Handlebars.compile(source)

const URL = 'https://qmacro.org/feed.xml'

const main = async _ => {
  try {
    const feed = await parser.parseURL(URL)
    console.log(template(feed))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()




