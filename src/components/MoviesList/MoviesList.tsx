import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import MovieData from '../MovieCard/MovieData';

import './MoviesList.css';

type MoviesListProps = {
  moviesList: MovieData[];
  onRateMovie: (id: number, rating: number) => void;
  ratedMovies: Map<number, number>
};

function MoviesList({ moviesList, onRateMovie, ratedMovies }: MoviesListProps) {
  const movies = moviesList.map((movie) =>
    <MovieCard
      key={movie.id}
      movieData={movie}
      onRateMovie={onRateMovie}
      ratedMovies={ratedMovies}
    />);

  return <ul className="movie-list">{movies}</ul>;
}

export default MoviesList;
