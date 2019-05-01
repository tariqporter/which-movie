const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { getMovieList, getMovieDetails } = require('./movieLoader');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ movies: [] }).write();
const moviesTable = db.get('movies');

let page = 0;
const isRunning = true;

const getNextPage = () => {
  console.log(`Retrieving page ${page}`);
  getMovieList(page).then((movieList) => {
    if (!movieList.length) {
      isRunning = false;
      console.warn(`No movies returned. Stopping parsing at page ${page - 1}`);
      return;
    }
    movieList.forEach(({ name, url, score, date }) => {
      const existingMovie = moviesTable.find({ url }).value();
      if (!existingMovie) {
        getMovieDetails(url).then(({ genres }) => {
          moviesTable.push({ name, score, url, genres, date }).write();
          page++;
          getNextPage();
        }).catch(err => console.log(err));;
      }
    });
  }).catch(err => console.log(err));
};

getNextPage();