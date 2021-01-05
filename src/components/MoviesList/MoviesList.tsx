import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

import './MoviesList.css';
import { MovieData } from '../../services/MovieService';

type MoviesListProps = {
  moviesList: MovieData[];
};

function MoviesList({ moviesList }: MoviesListProps) {
  const movies = moviesList.map((movie) => <MovieCard movieData={movie} />);
  return (
    <section className="movies">
      <ul className="movie-list">{movies}</ul>
    </section>
  );
}

export default MoviesList;
