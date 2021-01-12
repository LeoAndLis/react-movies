import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { debounce } from 'lodash';
import MoviesList from './components/MoviesList/MoviesList';
import Search from './components/Search/Search';
import MovieService, { MovieData } from './services/MovieService';

import './App.css';

type AppState = {
  currentPage: number;
  error: boolean;
  hasData: boolean;
  loading: boolean;
  moviesList: MovieData[];
  queryString: string;
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  movies = new MovieService();

  state: AppState = {
    currentPage: 1,
    error: false,
    hasData: false,
    loading: true,
    moviesList: [],
    queryString: 'return',
  };

  componentDidMount() {
    this.updateList();
  }

  componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>) {
    const { currentPage } = this.state;
    if (prevState.currentPage !== currentPage) {
      console.log(`change page from ${prevState.currentPage} to ${currentPage}`);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  onSetQuery = debounce((queryString: string) => {
    if (queryString === '') {
      this.setState({
        error: false,
        hasData: false,
      });
      return;
    }

    this.setState({
      error: false,
      hasData: false,
      loading: true,
      queryString,
    });

    this.updateList();
  }, 500);

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateList() {
    const { queryString } = this.state;
    this.movies
      .getMovies(queryString)
      .then((result) => {
        this.setState({
          moviesList: result.results,
          loading: false,
          hasData: true,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { error, hasData, loading, moviesList, queryString } = this.state;

    const errorMessage = error && <Alert message="Error" description="No movies found for your request" type="error" />;
    const spinner = loading && <Spin tip="Loading..." />;
    const content = !(error || loading) && hasData && <MoviesList moviesList={moviesList} />;

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
        <section className="pagination">
          <ul className="pages-lis">
            <li className="pages-list__item prev-page">prev</li>
            <li className="pages-list__item">1</li>
            <li className="pages-list__item">2</li>
            <li className="pages-list__item">3</li>
            <li className="pages-list__item">4</li>
            <li className="pages-list__item">5</li>
            <li className="pages-list__item next-page">next</li>
          </ul>
        </section>
      </main>
    );
  }
}

export default App;
