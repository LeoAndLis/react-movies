import React from 'react';
import cutText from '../../lib/cutText';

import './MovieCard.css';

const MovieCard = ({ movieData }: any) => {
  const {
    original_title: originalTitle,
    overview,
    release_date: releaseDate,
    vote_average: voteAverage,
    poster_path: posterPath,
  } = movieData;
  return (
    <li className="movie-list__item movie-item">
      <article className="card">
        <div className="card__img-container">
          <img className="card__img" src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt="movie" />
        </div>
        <div className="card__title-container">
          <h2 className="card__title">{originalTitle}</h2>
          <span className="card__rating">{voteAverage}</span>
          <time className="card__datetime">{releaseDate}</time>
          <ul className="genre-list">
            <li className="genre-list__item">Action</li>
            <li className="genre-list__item">Drama</li>
          </ul>
        </div>
        <p className="card__overview">{cutText(overview)}</p>
        <ul className="voting-list card__voting">
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
          <li className="voting-list__item">*</li>
        </ul>
      </article>
    </li>
  );
};

export default MovieCard;
