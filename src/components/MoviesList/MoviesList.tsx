import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

import './MoviesList.css';
import { MovieData } from '../../services/MovieService';

type MoviesListProps = {
  moviesList: MovieData[];
};

function MoviesList({ moviesList }: MoviesListProps) {
  const movies = moviesList.map((movie) => <MovieCard movieData={movie} key={movie.id} />);

  return <ul className="movie-list">{movies}</ul>;
}

export default MoviesList;
