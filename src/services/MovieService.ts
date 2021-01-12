export type MovieData = {
  id: number;
  tittle: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

export default class MovieService {
  protected readonly API_KEY = 'b25f126af2294cd8333cc6c198c6c174';

  protected readonly API_MOVIE_PATH = 'https://api.themoviedb.org/3/';

  protected readonly API_SEARCH_MOVIE_PATH = 'search/movie';

  protected readonly API_SEARCH_MOVIE_GENRES = 'genre/movie/list';

  protected makeQueryString(params: Object) {
    const esc = encodeURIComponent;

    return (
      Object.keys(params)
        // @ts-ignore
        .map((key: string) => `${esc(key)}=${esc(params[key])}`)
        .join('&')
    );
  }

  protected async getResource(path: string, params: Object = {}, method: string = 'GET') {
    const queryString = this.makeQueryString({
      api_key: this.API_KEY,
      ...params,
    });
    const url = `${this.API_MOVIE_PATH}${path}?${queryString}`;
    const response = await fetch(url, { method });

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }

    return response.json();
  }

  public getMovies(query: string, page: number = 1) {
    const params = {
      query,
      page,
    };

    return this.getResource(`${this.API_SEARCH_MOVIE_PATH}`, params);
  }

  public getGenres() {
    return this.getResource(`${this.API_SEARCH_MOVIE_GENRES}`);
  }
}
