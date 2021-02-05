import React from 'react';

const defaultValue: Record<number, string> = {};

const {
  Provider: GenresListProvider,
  Consumer: GenresListConsumer,
} = React.createContext(defaultValue);

export { GenresListProvider, GenresListConsumer };
