import ApiMovieRequestService from './ApiMovieRequestService';
import { transformGenresList } from './DataProcessing';

export default class GenresSevice {
  apiRequest = new ApiMovieRequestService();
  
  protected readonly API_SEARCH_MOVIE_GENRES_PATH = '/genre/movie/list';
  
  public async getGenres(): Promise<Record<number, string>> {
    const respond = await this.apiRequest.getResource(this.API_SEARCH_MOVIE_GENRES_PATH);
    return transformGenresList(respond.genres);
  }
}
