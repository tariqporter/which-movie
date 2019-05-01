
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

exports.genres = () => {
  const genres = db.get('movies').value().reduce((acc, x) => {
    const newGenres = x.genres.filter(x2 => !acc.includes(x2));
    if (newGenres.length) {
      acc.push(...newGenres);
    }
    return acc;
  }, []);
  return genres;
};

exports.moviesByGenre = (genre, movies) => {
  const predicate = x => x => x.genres.includes(genre);
  let filteredMovies = [];
  if (movies) {
    filteredMovies = movies.filter(predicate);
  } else {
    filteredMovies = db.get('movies').filter(predicate).value();
  }
  return filteredMovies;
};

exports.moviesByScore = (score, movies) => {
  const predicate = x => x => x.score >= score;
  let filteredMovies = [];
  if (movies) {
    filteredMovies = movies.filter(predicate);
  } else {
    filteredMovies = db.get('movies').filter(predicate).value();
  }
  return filteredMovies;
};

exports.moviesNumberReviews = (numberReviews, movies) => {
  const predicate = x => x.numberReviews >= numberReviews;
  let filteredMovies = [];
  if (movies) {
    filteredMovies = movies.filter(predicate);
  } else {
    filteredMovies = db.get('movies').filter(predicate).value();
  }
  return filteredMovies;
};

exports.moviesByStarring = (partialStarring, movies) => {
  const predicate = x => x.starring.some(y => y.includes(partialStarring));
  let filteredMovies = [];
  if (movies) {
    filteredMovies = filteredMovies.filter(predicate);
  } else {
    filteredMovies = db.get('movies').filter(predicate).value();
  }
  return filteredMovies;
};