import axios from 'axios';
import { BASE_URL } from 'consts';
import SpotifyWebApi from 'spotify-web-api-node';

const smartifyClient = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 100000,
  withCredentials: true,
});

const spotifyBasicClient = new SpotifyWebApi();

export { smartifyClient, spotifyBasicClient };
