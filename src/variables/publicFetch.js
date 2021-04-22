import axios from "axios";

const baseURL = process.env.REACT_APP_URL;
const staticURL = process.env.REACT_APP_URL;

const publicFetch = axios.create({
  baseURL,
});

export { publicFetch, baseURL, staticURL };
