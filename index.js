const axios = require('axios');
const cheerio = require('cheerio');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ movies: [] }).write();
const moviesTable = db.get('movies');

// const genres = ['adventure', 'comedy'];

//
//https://www.metacritic.com/browse/movies/genre/date/${genres[1]}?view=condensed&page=0

axios.get(`https://www.metacritic.com/browse/movies/score/metascore/all/filtered?page=0`)
  .then(result => {
    const $ = cheerio.load(result.data);
    // const movies = $('.product_wrap').map((idx, x) => $(x)).get();
    const movies = $('.clamp-summary-wrap').map((idx, x) => $(x)).get();
    movies.forEach(movie => {
      // const title = $(movie).find('.basic_stat.product_title a').eq(0);
      // const name = title.text();
      // const url = title.attr('href');
      // const score = $(movie).find('.metascore_w').eq(0).html();
      // const date = $(movie).find('.release_date .data').eq(0).html();

      const title = $(movie).find('a.title').eq(0);
      const name = title.text();
      const url = title.attr('href');
      const score = $(movie).find('.metascore_w').eq(0).text();
      const date = $(movie).find('.clamp-details span').eq(1).text();
      if (name && url && score && date) {
        const existingMovie = moviesTable.find({ url }).value();
        if (!existingMovie) {
          const newMovie = {
            name: name.trim(),
            url: `https://www.metacritic.com${url}`,
            score: parseInt(score.trim(), 10),
            date: date.trim()
          };
          db.get('movies').push(newMovie).write();
        }
      }
    });
  })
  .catch(err => {
    console.log(err);
  });