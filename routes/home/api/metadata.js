const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-description")(),
  require("metascraper-title")(),
  require("metascraper-image")(),
  require("metascraper-youtube")()
]);

const got = require("got");

//my urls to be scraped for data

async function getMetaData(urls) {
  const { body: html, url } = await got(urls).catch(e => {
    console.log(e);
  });
  const metadata = await metascraper({ html, url });
  const title = metadata.title;
  const description = metadata.description;
  const author = metadata.author;
  const image = metadata.image;
  return (metaData = {
    title,
    description,
    author,
    image
  });
}

module.exports = getMetaData;
