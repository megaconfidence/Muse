import environment from './index';
const baseApi = 'https://muse-api.herokuapp.com';
const env = environment(baseApi);
export default {
  ...env
};
