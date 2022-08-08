import axios from 'axios';
import { API } from '../config';

// TODO: Uncomment to swap from API Gateway backend to client side only
// import config from '../config';
// const params = new URLSearchParams(config.credentials);
// export const authURL = `https://accounts.spotify.com/authorize?${params.toString()}`;

export const authURL = `${API.API_BASE_URL}/login`;

// Setup Axios for Spotify API calls 
export const apiURL = "https://api.spotify.com/v1";
export const spotify = axios.create({ baseURL: apiURL });
export const setToken = (token: string) => spotify.defaults.headers.common = { Authorization: `Bearer ${token}` };