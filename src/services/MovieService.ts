import { transformMovieData, transformGenresList } from './DataProcessing';

export default class MovieService {
  protected readonly API_KEY = 'b25f126af2294cd8333cc6c198c6c174';

  protected readonly API_MOVIE_PATH = 'https://api.themoviedb.org/3';

  protected readonly API_CREATE_GUEST_SESSION_PATH = '/authentication/guest_session/new';

  protected readonly API_GET_RATED_MOVIES_PATH = '/guest_session/{guest_session_id}/rated/movies';

  protected readonly API_RATE_MOVIE_PATH = '/movie/{movie_id}/rating';

  protected readonly API_SEARCH_MOVIE_PATH = '/search/movie';

  protected readonly API_SEARCH_MOVIE_GENRES_PATH = '/genre/movie/list';

  protected makeQueryString(params: Object) {
    const esc = encodeURIComponent;

    return (
      Object.keys(params)
        // @ts-ignore
        .map((key: string) => `${esc(key)}=${esc(params[key])}`)
        .join('&')
    );
  }

  protected async getResource(path: string, getParams: Object = {}, method: string = 'GET', postParams: Object = {}) {
    const queryString = this.makeQueryString({
      api_key: this.API_KEY,
      ...getParams,
    });
    const url = `${this.API_MOVIE_PATH}${path}?${queryString}`;
    const params: any = { method };

    if (method === 'POST') {
      params.body = JSON.stringify(postParams);
      params.headers = { 'Content-Type': 'application/json;charset=utf-8' };
    }

    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }

    return response.json();
  }

  private async getMovies(path: string, params: any = {}) {
    const { page: currentPage, results, total_pages: totalPages, total_results: totalResults } = await this.getResource(
      `${path}`,
      params,
    );

    if (totalResults === 0) {
      throw Error('No results');
    }

    const movieList = results.map(transformMovieData);

    return { currentPage, movieList, totalPages, totalResults };
  }

  public getSearchedMovies(query: string, page: number = 1) {
    const params = {
      query,
      page,
    };

    return this.getMovies(this.API_SEARCH_MOVIE_PATH, params);
  }

  public getRatedMovies(sessionId: string) {
    const path = this.API_GET_RATED_MOVIES_PATH.replace('{guest_session_id}', sessionId);
    return this.getMovies(path);
  }

  public async getGenres() {
    const respond = await this.getResource(this.API_SEARCH_MOVIE_GENRES_PATH);
    return transformGenresList(respond.genres);
  }

  public getSessionId() {
    return this.getResource(this.API_CREATE_GUEST_SESSION_PATH);
  }

  public rateMovie(sessionId: string, movieId: number, value: number) {
    const path = this.API_RATE_MOVIE_PATH.replace('{movie_id}', movieId.toString());
    const body = { value };
    const params = { guest_session_id: sessionId };

    return this.getResource(path, params, 'POST', body);
  }
}
