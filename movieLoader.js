const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

// 0 index page
exports.getMovieList = (page) => {
  return axios.get(`https://www.metacritic.com/browse/movies/score/metascore/all/filtered?page=${page}`)
    .then(result => {
      const $ = cheerio.load(result.data);
      const movies = $('.clamp-summary-wrap').map((i, x) => $(x)).get();
      const parsedMovies = [];
      movies.forEach(movie => {
        const title = $(movie).find('a.title').eq(0);
        const url = `https://www.metacritic.com${title.attr('href')}`;
        parsedMovies.push({ url });
      });
      return parsedMovies;
    });
};

exports.getMovieDetails = (url) => {
  return axios.get(url)
    .then(result => {
      const $ = cheerio.load(result.data);
      const genres = $('.genres > span span').map((i, x) => $(x).text()).get();
      const numberReviewsText = $('.based_on').text(); // based on 29 Critics
      const numberReviewsMatch = /(\d+) Critics/gi.exec(numberReviewsText);
      const numberReviews = parseInt(numberReviewsMatch[1], 10);
      const name = $('.product_page_title h1').text();
      const score = $('.metascore_w').eq(0).text();
      const date = $('.release_date span').eq(1).text();
      const summary = $('.blurb_expanded').text();
      const starring = $('.summary_cast span').eq(1).find('a').map((i, x) => $(x).text()).get();
      return {
        name,
        score: parseInt(score, 10),
        genres,
        date: moment(date, 'MMMM D, YYYY'), // March 11, 1972
        numberReviews,
        summary,
        starring
      };
    });
};
