const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

// 0 index page
exports.getMovieList = (page) => {
  return axios.get(`https://www.metacritic.com/browse/movies/score/metascore/all/filtered?page=${page}`)
    .then(result => {
      const $ = cheerio.load(result.data);
      const movies = $('.clamp-summary-wrap').map((idx, x) => $(x)).get();
      const parsedMovies = [];
      movies.forEach(movie => {
        const title = $(movie).find('a.title').eq(0);
        const name = title.text();
        const url = `https://www.metacritic.com${title.attr('href')}`;
        const score = $(movie).find('.metascore_w').eq(0).text();
        const date = $(movie).find('.clamp-details span').eq(1).text();
        if (name && url && score && date) {
          const newMovie = {
            name: name.trim(),
            url,
            score: parseInt(score.trim(), 10),
            date: moment(date.trim(), 'MMMM D, YYYY') // March 11, 1972 
          };
          parsedMovies.push(newMovie);
        }
      });
      return parsedMovies;
    });
};

exports.getMovieDetails = (url) => {
  return axios.get(url)
    .then(result => {
      const $ = cheerio.load(result.data);
      const genres = $('.genres > span span').map((i, x) => $(x).text()).get();
      return { genres };
    });
};
