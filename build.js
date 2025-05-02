const Parser = require('rss-parser')
const parser = new Parser({
  headers: {
    'Accept': 'application/atom+xml'
  },
  customFields: {
    item: ['updated']
  }
})

const request = require('then-request')

const Handlebars = require('handlebars')
const template = Handlebars.compile(require('./template'))

const maxItems = 3

const sources = {
  RSS: {
    qmacro: 'https://qmacro.org/feed.xml',
    ytqmacro: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCDUgrP3koL_o2iz6m55H1uA',
    ytsapdevs: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0',
    techaloud: 'https://anchor.fm/s/e5dc36c/podcast/rss'
  }
}

// Return a given object, but with the date property formatted nicely
const niceDate = item => {
  item._date = new Date(item._date).toDateString()
  return item
}

const normalise = {
  RSS: item => {
    item._title = item.title
    item._link = item.link
    item._date = item.pubDate
    item._excerpt = item.contentSnippet && item.contentSnippet.substring(0, 50) + '…'
    return item
  }
}

// Return the latest N items from an RSS feed
const latestRSS = async URL => {
  const feed = await parser.parseURL(URL)
  return feed
    .items
    .slice(0, maxItems)
    .map(normalise.RSS)
    .map(niceDate)
}

const main = async () => {
  try {
    const feeds = {}
    feeds.qmacro = await latestRSS(sources.RSS.qmacro)
    feeds.ytqmacro = await latestRSS(sources.RSS.ytqmacro)
    feeds.ytsapdevs = await latestRSS(sources.RSS.ytsapdevs)
    feeds.techaloud = await latestRSS(sources.RSS.techaloud)
    console.log(template({
      qmacro: feeds.qmacro,
      ytqmacro: feeds.ytqmacro,
      ytsapdevs: feeds.ytsapdevs,
      techaloud: feeds.techaloud
    }))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()
