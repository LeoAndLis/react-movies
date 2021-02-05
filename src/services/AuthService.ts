import ApiMovieRequestService from './ApiMovieRequestService';

type GetSessionId = {
  success?: boolean;
  guest_session_id?: string;
  expires_at?: string;
};

export default class AuthService {
  apiRequest = new ApiMovieRequestService();

  protected readonly API_CREATE_GUEST_SESSION_PATH = '/authentication/guest_session/new';
  
  public getSessionId(): Promise<GetSessionId> {
    return this.apiRequest.getResource(this.API_CREATE_GUEST_SESSION_PATH);
  }
}
