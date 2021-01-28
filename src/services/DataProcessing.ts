import { format } from 'date-fns';
import MovieData from '../components/MovieCard/MovieData';
import noImage from '../images/no_img.png';

const MOVIE_IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const MOVIE_OVERVIEW_LENGTH = 150;

function cutText(text: string): string {
  if (text.length <= MOVIE_OVERVIEW_LENGTH) {
    return text;
  }

  const result = text.slice(0, MOVIE_OVERVIEW_LENGTH);
  const spaceIndex = result.lastIndexOf(' ');

  return `${result.slice(0, spaceIndex)}...`;
}

function makePosterPath(posterPath: string): string {
  if (!posterPath) {
    return noImage;
  }

  return MOVIE_IMG_PATH + posterPath;
}

function makeDate(date: string): string {
  if (!date) {
    return '';
  }

  return format(new Date(date), 'MMMM d, yyyy');
}

function transformMovieData(movie: any): MovieData {
  const movieCopy = { ...movie };

  const { genre_ids: genreIds, id, title, vote_average: voteAverage } = movieCopy;

  let { overview, poster_path: posterPath, release_date: releaseDate } = movieCopy;

  posterPath = makePosterPath(posterPath);

  releaseDate = makeDate(releaseDate);

  overview = cutText(overview);

  return {
    genreIds,
    id,
    title,
    overview,
    posterPath,
    releaseDate,
    voteAverage,
  };
}

type GenresListElement = {
  id: number;
  name: string;
};

function transformGenresList(genresList: any): Map<number, string> {
  const formatedGenres = new Map();
  genresList.forEach((element: GenresListElement) => {
    formatedGenres.set(element.id, element.name);
  });

  return formatedGenres;
}

export { transformMovieData, transformGenresList };
