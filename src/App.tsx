import React, { Component } from 'react';
import MoviesList from './components/MoviesList/MoviesList';
import MovieService, { MovieData } from './services/MovieService';

import './App.css';

type AppState = {
  moviesList: MovieData[];
};

type AppProps = {};

class App extends Component<AppProps, AppState> {
  movies = new MovieService();

  state: AppState = {
    moviesList: [],
  };

  constructor(props: AppProps) {
    super(props);

    this.updateList();
  }

  updateList() {
    this.movies.getMovies('return').then((result) => {
      this.setState({ moviesList: result.results });
    });
  }

  render() {
    const { moviesList } = this.state;
    return (
      <main className="main">
        <section className="nav-section">
          <ul className="tabs">
            <li className="tabs__item">Search</li>
            <li className="tabs__item">Ranked</li>
          </ul>
          <input type="text" className="search" />
        </section>
        <MoviesList moviesList={moviesList} />
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
