
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
  let filteredMovies = [];
  if (movies) {
    filteredMovies = movies.filter(x => x.genres.includes(genre));
  } else {
    filteredMovies = db.get('movies').filter(x => x.genres.includes(genre)).value();
  }
  return filteredMovies;
};

exports.moviesByScore = (score, movies) => {
  let filteredMovies = [];
  if (movies) {
    filteredMovies = movies.filter(x => x.score >= score);
  } else {
    filteredMovies = db.get('movies').filter(x => x.score >= score).value();
  }
  return filteredMovies;
};