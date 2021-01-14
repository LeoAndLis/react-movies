import React, { Component } from 'react';
import { Alert, Pagination, Spin } from 'antd';
import { debounce } from 'lodash';

import MoviesList from './components/MoviesList/MoviesList';
import Search from './components/Search/Search';
import MovieService from './services/MovieService';

import MovieData from './components/MovieCard/MovieData';

import './App.css';

type AppState = {
  currentPage: number;
  error: boolean;
  hasMovies: boolean;
  hideOnSinglePage: boolean;
  loading: boolean;
  moviesList: MovieData[];
  totalMovies: number;
  queryString: string;
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  movies = new MovieService();

  state: AppState = {
    currentPage: 1,
    error: false,
    hasMovies: false,
    hideOnSinglePage: true,
    loading: true,
    moviesList: [],
    totalMovies: 0,
    queryString: 'return',
  };

  componentDidMount() {
    this.updateList();
  }

  componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>) {
    const { currentPage } = this.state;
    if (currentPage !== prevState.currentPage) {
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

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateList() {
    const { currentPage, queryString } = this.state;
    console.log(`updateList  ${currentPage}`);
    this.movies
      .getMovies(queryString, currentPage)
      .then((result) => {
        console.log(result);
        this.setState({
          moviesList: result.movieList,
          loading: false,
          hasMovies: !!result.totalResults,
          totalMovies: result.totalResults,
        });
      })
      .catch(this.onError);
  }

  render() {
    const {
      currentPage,
      error,
      hasMovies,
      hideOnSinglePage,
      loading,
      moviesList,
      totalMovies,
      queryString,
    } = this.state;

    const errorMessage = error && <Alert message="Error" description="No movies found by your request" type="error" />;
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
          <ul className="tabs">
            <li className="tabs__item">Search</li>
            <li className="tabs__item">Ranked</li>
          </ul>
          <Search setQuery={this.onSetQuery} queryString={queryString} />
        </section>
        <section className="movies">
          {errorMessage}
          {spinner}
          {content}
        </section>
        {pagination}
      </main>
    );
  }
}

export default App;
