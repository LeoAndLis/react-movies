import React, { Component } from 'react';
import { Rate } from 'antd';
import classNames from 'classnames';
import MovieData from './MovieData';
import { GenresListConsumer } from '../GenresListContext/GenresListContext';

import './MovieCard.css';

type MovieCardProps = {
  movieData: MovieData;
  onRateMovie: (id: number, rating: number) => void;
  ratedMovies: Map<number, number>
};

type MovieCardState = {
  rating: number;
};

class MovieCard extends Component<MovieCardProps, MovieCardState> {

  state: MovieCardState;

  constructor(props: MovieCardProps) {
    super(props);
    this.state = {
      rating: 0,
    };
  }

  componentDidMount() {
    const { movieData: { id }, ratedMovies } = this.props;
    const rate = ratedMovies.get(id) || 0;
    if ( rate ) {
      this.setState({rating: rate});
    }
  }

  rateMovie(rating: number) {
    const { onRateMovie, movieData: { id } } = this.props;
    this.setState({rating});
    onRateMovie(id, rating);
  }

  render() {
    const { rating } = this.state;
    const { movieData } = this.props;
    const { title, overview, posterPath, releaseDate, voteAverage } = movieData;
    const genres = (
      <GenresListConsumer>
        {(genresList) => (
          <ul className="genre-list">
            {movieData.genreIds.map((genreId) => (
              <li key={genreId} className="genre-list__item">
                {genresList.get(genreId)}
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
          <Rate
            className="voting-list card__voting"
            count={10}
            disabled={rating > 0}
            onChange={(value) => this.rateMovie(value)}
            value={rating}
          />
        </article>
      </li>
    );
  }
}

export default MovieCard;
