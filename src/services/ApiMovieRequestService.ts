export default class ApiMovieRequestService {
  protected readonly API_KEY = 'b25f126af2294cd8333cc6c198c6c174';

  protected readonly API_PATH = 'https://api.themoviedb.org/3';

  protected makeQueryString(params: Object) {
    const esc = encodeURIComponent;

    return (
      Object.keys(params)
        // @ts-ignore
        .map((key: string) => `${esc(key)}=${esc(params[key])}`)
        .join('&')
    );
  }

  public async getResource(path: string, getParams: Object = {}, method: string = 'GET', postParams: Object = {}) {
    const queryString = this.makeQueryString({
      api_key: this.API_KEY,
      ...getParams,
    });
    const url = `${this.API_PATH}${path}?${queryString}`;
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
}
