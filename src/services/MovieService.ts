import { transformMovieData } from './DataProcessing';
import ApiMovieRequestService from './ApiMovieRequestService';
import MovieData from '../components/MovieCard/MovieData';

type GetMoviesData = {
  currentPage: number;
  movieList: MovieData[];
  totalPages: number;
  totalResults: number;
};

type RateMovie = {
  status_code?: number;
  status_message?: string;
};

export default class MovieService {
  apiRequest = new ApiMovieRequestService();

  protected readonly API_GET_RATED_MOVIES_PATH = '/guest_session/{guest_session_id}/rated/movies';

  protected readonly API_RATE_MOVIE_PATH = '/movie/{movie_id}/rating';

  protected readonly API_SEARCH_MOVIE_PATH = '/search/movie';

  private async getMovies(path: string, params: any = {}): Promise<GetMoviesData> {
    const {
      page: currentPage,
      results,
      total_pages: totalPages,
      total_results: totalResults,
    } = await this.apiRequest.getResource(
      path,
      params,
    );

    if (totalResults === 0) {
      throw Error('No results');
    }

    const movieList = results.map(transformMovieData);

    return { currentPage, movieList, totalPages, totalResults };
  }

  public getSearchedMovies(query: string, page: number = 1): Promise<GetMoviesData> {
    const params = {
      query,
      page,
    };

    return this.getMovies(this.API_SEARCH_MOVIE_PATH, params);
  }

  public getRatedMovies(sessionId: string, page: number = 1): Promise<GetMoviesData> {
    const path = this.API_GET_RATED_MOVIES_PATH.replace('{guest_session_id}', sessionId);
    return this.getMovies(path, { page });
  }

  public rateMovie(sessionId: string, movieId: number, value: number): Promise<RateMovie> {
    const path = this.API_RATE_MOVIE_PATH.replace('{movie_id}', movieId.toString());
    const body = { value };
    const params = { guest_session_id: sessionId };

    return this.apiRequest.getResource(path, params, 'POST', body);
  }
}
