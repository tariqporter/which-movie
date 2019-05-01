const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { getMovieList, getMovieDetails } = require('./movieLoader');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ movies: [] }).write();
const moviesTable = db.get('movies');

getMovieList(0).then((movieList) => {
  movieList.forEach(({ name, url, score, date }) => {
    const existingMovie = moviesTable.find({ url }).value();
    if (!existingMovie) {
      getMovieDetails(url).then(({ genres }) => {
        moviesTable.push({ name, score, url, genres, date }).write();
      }).catch(err => console.log(err));;
    }
  });
}).catch(err => console.log(err));