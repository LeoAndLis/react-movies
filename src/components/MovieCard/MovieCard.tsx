import React, { Component } from 'react';
import { Rate, Spin } from 'antd';
import classNames from 'classnames';
import MovieData from './MovieData';
import { GenresListConsumer } from '../GenresListContext/GenresListContext';

import './MovieCard.css';

type MovieCardProps = {
  movieData: MovieData;
  onRateMovie: (id: number, rating: number) => void;
  ratedMovies: Record<number, number>
};

type MovieCardState = {
  loadingRating: boolean;
};

class MovieCard extends Component<MovieCardProps, MovieCardState> {

  state: MovieCardState = {
    loadingRating: false,
  };

  shouldComponentUpdate(nextProps: Readonly<MovieCardProps>, nextState: Readonly<MovieCardState>) {
    const { loadingRating } = this.state;
    const { movieData: { id }, ratedMovies } = this.props;
    if ( ratedMovies[id] !== nextProps.ratedMovies[id] || loadingRating !== nextState.loadingRating ) {
      return true;
    }

    return false;
  }

  static getDerivedStateFromProps(nextProps: Readonly<MovieCardProps>) {
    const { movieData: { id } } = nextProps;
    if (nextProps.ratedMovies[id] > 0) {
      return {loadingRating: false};
    }

    return null;

  }

  rateMovie(rating: number) {
    const { onRateMovie, movieData: { id } } = this.props;
    this.setState({loadingRating: true});
    onRateMovie(id, rating);
  }

  render() {
    const { loadingRating } = this.state;
    const { movieData, ratedMovies } = this.props;
    const { id, title, overview, posterPath, releaseDate, voteAverage } = movieData;
    console.log(`render movie card ${ title }`);
    const genres = (
      <GenresListConsumer>
        {(genresList) => (
          <ul className="genre-list">
            {movieData.genreIds.map((genreId) => (
              <li key={genreId} className="genre-list__item">
                {genresList[genreId]}
              </li>
            ))}
          </ul>
        )}
      </GenresListConsumer>
    );
    const voteAverageClass = classNames('card__rating', {
      'card__rating--normal': voteAverage >= 3 && voteAverage < 5,
      'card__rating--good': voteAverage >= 5 && voteAverage < 7,
      'card__rating--perfection': voteAverage >= 7,
    });

    const spin = loadingRating && <Spin className="voting-spin"/>;
    const rate = !loadingRating && <Rate
      className="voting-list card__voting"
      count={10}
      disabled={ratedMovies[id] > 0}
      onChange={(value) => this.rateMovie(value)}
      value={ratedMovies[id]}
    />;

    return (
      <li className="movie-list__item movie-item">
        <article className="card">
          <div className="card__img-container">
            <img className="card__img" src={posterPath} alt={title} />
          </div>
          <div className="card__title-container">
            <h2 className="card__title">{title}</h2>
            <span className={voteAverageClass}>
              {voteAverage}
            </span>
            <time className="card__datetime">{releaseDate}</time>
            {genres}
          </div>
          <p className="card__overview">{overview}</p>
          {spin}
          {rate}
        </article>
      </li>
    );
  }
}

export default MovieCard;
