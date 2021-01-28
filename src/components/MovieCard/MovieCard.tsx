import React from 'react';
import { Rate } from 'antd';
import classNames from 'classnames';
import MovieData from './MovieData';
import { GenresListConsumer } from '../GenresListContext/GenresListContext';

import './MovieCard.css';

type MovieCardProps = {
  movieData: MovieData;
};

const MovieCard = ({ movieData }: MovieCardProps) => {
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
  return (
    <li className="movie-list__item movie-item">
      <article className="card">
        <div className="card__img-container">
          <img className="card__img" src={posterPath} alt={title} />
        </div>
        <div className="card__title-container">
          <h2 className="card__title">{title}</h2>
          <span
            className={classNames('card__rating', {
              'card__rating--normal': voteAverage >= 3 && voteAverage < 5,
              'card__rating--good': voteAverage >= 5 && voteAverage < 7,
              'card__rating--perfection': voteAverage >= 7,
            })}
          >
            {voteAverage}
          </span>
          <time className="card__datetime">{releaseDate}</time>
          {genres}
        </div>
        <p className="card__overview">{overview}</p>
        <Rate className="voting-list card__voting" count={10} />
      </article>
    </li>
  );
};

export default MovieCard;
