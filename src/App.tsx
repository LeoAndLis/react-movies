import React, { Component } from 'react';
import { Alert, Pagination, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';

import MoviesList from './components/MoviesList/MoviesList';
import Search from './components/Search/Search';
import MovieService from './services/MovieService';
import { GenresListProvider } from './components/GenresListContext/GenresListContext';

import MovieData from './components/MovieCard/MovieData';

import './App.css';

type AppState = {
  currentPage: number;
  currentTab: string;
  error: boolean;
  errorMessage: string;
  hasMovies: boolean;
  hideOnSinglePage: boolean;
  loading: boolean;
  moviesList: MovieData[];
  sessionId: string;
  totalMovies: number;
  queryString: string;
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  movies = new MovieService();

  genresList = new Map();

  state: AppState = {
    currentPage: 1,
    currentTab: 'Search',
    error: false,
    errorMessage: '',
    hasMovies: false,
    hideOnSinglePage: true,
    loading: true,
    moviesList: [],
    sessionId: '',
    totalMovies: 0,
    queryString: 'return',
  };

  componentDidMount() {
    this.movies.getGenres().then((genres) => {
      this.genresList = new Map(genres.entries());
      return this.genresList;
    });
    this.movies.getSessionId().then((result) => this.setState({ sessionId: result.guest_session_id }));
    this.updateList();
  }

  componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>) {
    const { currentPage, currentTab } = this.state;
    if (currentPage !== prevState.currentPage || currentTab !== prevState.currentTab) {
      this.updateList();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  onSetQuery = debounce((queryString: string) => {
    if (queryString === '') {
      this.setState({
        error: false,
        hasMovies: false,
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
      });
    }
  };

  onError = (error: Error) => {
    this.setState({
      error: true,
      errorMessage: error.message,
      loading: false,
    });
  };

  setMoviesList = (result: any) => {
    this.setState({
      moviesList: result.movieList,
      loading: false,
      hasMovies: !!result.totalResults,
      totalMovies: result.totalResults,
    });
  };

  updateList() {
    const { currentPage, queryString, currentTab, sessionId } = this.state;
    switch (currentTab) {
      case 'Rated':
        this.movies
          .getRatedMovies(sessionId)
          .then((result) => {
            this.setMoviesList(result);
          })
          .catch(this.onError);
        break;
      default:
      case 'Search':
        this.movies
          .getSearchedMovies(queryString, currentPage)
          .then((result) => {
            this.setMoviesList(result);
          })
          .catch(this.onError);
        break;
    }
  }

  render() {
    const {
      currentPage,
      currentTab,
      error,
      errorMessage,
      hasMovies,
      hideOnSinglePage,
      loading,
      moviesList,
      sessionId,
      totalMovies,
      queryString,
    } = this.state;

    console.log(sessionId);
    const { TabPane } = Tabs;
    const errorBlock = error && <Alert message="Error" description={errorMessage} type="error" />;
    const search = currentTab === 'Search' && <Search setQuery={this.onSetQuery} queryString={queryString} />;
    const spinner = loading && <Spin tip="Loading..." />;
    const content = !(error || loading) && hasMovies && <MoviesList moviesList={moviesList} />;
    const pagination = !(error || loading) && hasMovies && (
      <Pagination
        current={currentPage}
        defaultPageSize={20}
        hideOnSinglePage={hideOnSinglePage}
        onChange={this.onChangePage}
        size="small"
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
          <GenresListProvider value={new Map(this.genresList.entries())}>
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
