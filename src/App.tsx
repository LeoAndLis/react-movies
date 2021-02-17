import React, { Component } from 'react';
import { Alert, Pagination, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';

import MoviesList from './components/MoviesList/MoviesList';
import Search from './components/Search/Search';
import AuthService from './services/AuthService';
import GenresService from './services/GenresService';
import MovieService from './services/MovieService';
import { GenresListProvider } from './components/GenresListContext/GenresListContext';

import MovieData from './components/MovieCard/MovieData';

import './App.css';

type AlertType = 'error' | 'info' | 'success' | 'warning' | undefined;

type AppState = {
  alertMessage: string;
  currentPage: number;
  currentTab: string;
  defaultPageSize: number;
  error: boolean;
  genresList: Record<number, string>;
  loading: boolean;
  moviesList: MovieData[];
  ratedMovies: Record<number, number>;
  sessionId: string;
  totalMovies: number;
  queryString: string;
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  authService = new AuthService();

  genresService = new GenresService();

  movieService = new MovieService();

  state: AppState = {
    alertMessage: '',
    currentPage: 1,
    currentTab: 'Search',
    defaultPageSize: 20,
    error: false,
    genresList: {},
    loading: false,
    moviesList: [],
    ratedMovies: {},
    sessionId: '',
    totalMovies: 0,
    queryString: '',
  };

  componentDidMount() {
    this.genresService.getGenres().then((genresList) => {
      this.setState({genresList});
    });
    this.authService.getSessionId().then((result) =>
      this.setState({
        sessionId: result.guest_session_id ? result.guest_session_id : '',
      }),
    );
  }

  componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>) {
    const { currentPage, currentTab } = this.state;
    if (currentPage !== prevState.currentPage || currentTab !== prevState.currentTab) {
      this.updateList();
    }
  }

  componentDidCatch(error: Error) {
    this.onError(error);
  }

  onSetQuery = debounce((queryString: string) => {
    if (queryString === '') {
      this.setState({
        error: false,
      });
      return;
    }

    this.setState({
      error: false,
      loading: true,
      queryString,
    });

    this.updateList();
  }, 500);

  onChangePage = (page: number) => {
    const { currentPage } = this.state;
    if (page !== currentPage) {
      this.setState({
        error: false,
        loading: true,
        currentPage: page,
      });
    }
  };

  onChangeTab = (newTab: string) => {
    const { currentTab } = this.state;
    if (currentTab !== newTab) {
      this.setState({
        currentTab: newTab,
        loading: true,
        error: false,
        currentPage: 1,
      });
    }
  };

  onRateMovie = (id: number, rating: number) => {
    const { sessionId } = this.state;
    this.movieService.rateMovie(sessionId, id, rating)
      .then((result) => {
        if ( result.status_code === 1 ) {
          this.setState(({ratedMovies: oldRatedMovies}) => {
            const ratedMovies = { ...oldRatedMovies, [id]: rating};
            return {ratedMovies};
          });
        } else {
          const error = new Error(result.status_message);
          this.onError(error);
        }
      })
      .catch(this.onError);
  };

  onError = (error: Error) => {
    this.setState({
      error: true,
      alertMessage: error.message,
      loading: false,
    });
  };

  setMoviesList = (result: any) => {
    this.setState({
      moviesList: result.movieList,
      loading: false,
      totalMovies: result.totalResults,
    });
  };

  updateList() {
    const { currentPage, queryString, currentTab, sessionId } = this.state;
    switch (currentTab) {
      case 'Rated':
        this.movieService
          .getRatedMovies(sessionId, currentPage)
          .then((result) => {
            this.setMoviesList(result);
          })
          .catch(this.onError);
        break;
      default:
      case 'Search':
        if ( queryString === '' ) {
          this.setState({loading: false});
        } else {
          this.movieService
            .getSearchedMovies(queryString, currentPage)
            .then((result) => {
              this.setMoviesList(result);
            })
            .catch(this.onError);
        }
        break;
    }
  }

  render() {
    const {
      alertMessage,
      currentPage,
      currentTab,
      defaultPageSize,
      error,
      genresList,
      loading,
      moviesList,
      ratedMovies,
      totalMovies,
      queryString,
    } = this.state;

    let alertType: AlertType = 'error';
    if (alertMessage === 'No results') {
      alertType = 'info';
    }

    const { TabPane } = Tabs;
    const errorBlock = error && <Alert message={alertType.toUpperCase()} description={alertMessage} type={alertType} />;
    const search = currentTab === 'Search' && <Search setQuery={this.onSetQuery} queryString={queryString} />;
    const spinner = loading && <Spin className="spin" tip="Loading..." />;
    const content = !(error || loading) && !!totalMovies && <MoviesList moviesList={moviesList} onRateMovie={this.onRateMovie} ratedMovies={ratedMovies} />;
    const pagination = !(error || loading) && !!totalMovies && (
      <Pagination
        current={currentPage}
        defaultPageSize={defaultPageSize}
        onChange={this.onChangePage}
        size="small"
        hideOnSinglePage
        showSizeChanger={false}
        total={totalMovies}
      />
    );

    return (
      <main className="main">
        <section className="nav-section">
          <Tabs defaultActiveKey="Search" onChange={this.onChangeTab}>
            <TabPane tab="Search" key="Search" />
            <TabPane tab="Rated" key="Rated" />
          </Tabs>
          {search}
        </section>
        <section className="movies">
          <GenresListProvider value={genresList}>
            {errorBlock}
            {spinner}
            {content}
          </GenresListProvider>
        </section>
        {pagination}
      </main>
    );
  }
}

export default App;
