import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import config from 'environment';

/**
 * Create a new apollo client and export as default
 */
const token = localStorage.getItem(`${config.appName}_TOKEN`);

const link = new HttpLink({
  uri: `${config.api}/graphql`,
  headers: {
    authorization: token
  }
});
const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link,
  cache
});
export default apolloClient;
