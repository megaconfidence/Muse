import environment from './index';
const baseApi = 'https://muses-api.herokuapp.com';
const env = environment(baseApi);
export default {
  ...env
};
