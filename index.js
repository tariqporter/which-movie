const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { getMovieList, getMovieDetails } = require('./movieLoader');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ movies: [] }).write();
const moviesTable = db.get('movies');

let page = 0;

const getNextPage = () => {
  console.log(`Retrieving page ${page}`);
  getMovieList(page).then((movieList) => {
    if (!movieList.length) {
      console.warn(`No movies returned. Stopping parsing at page ${page}`);
      return;
    }

    const newMovieList = movieList.filter(({ url }) => !moviesTable.find({ url }).value());
    if (!newMovieList.length) {
      page++;
      getNextPage();
      return;
    }

    let successCount = 0;
    let completedCount = 0;
    newMovieList.forEach(({ name, url, score, date }) => {
      getMovieDetails(url).then(({ genres }) => {
        moviesTable.push({ name, score, url, genres, date }).write();
        successCount++;
        completedCount++;

        if (completedCount === newMovieList.length) { // All movies attempted
          if (successCount === completedCount) page++;
          getNextPage();
        }
      }).catch(err => {
        completedCount++;
        console.log(url, err);
      });
    });
  }).catch(err => console.log(err));
};

getNextPage();