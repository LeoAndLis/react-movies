import React, { Component } from 'react';

import './Search.css';

type SearchProps = {
  setQuery: (query: string) => void;
  queryString: string;
};

type SearchState = {
  queryString: string;
};

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = { queryString: props.queryString };
  }

  onInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { setQuery } = this.props;
    const queryString = event.target.value;
    this.setState({ queryString });
    setQuery(queryString);
  };

  render() {
    const { queryString } = this.state;
    return (
      <input
        placeholder="Type to search..."
        type="text"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => this.onInput(event)}
        value={queryString}
        className="search"
      />
    );
  }
}

export default Search;
