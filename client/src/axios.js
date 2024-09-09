import axios from "axios";

const baseURL = document.location.origin + "/api";


export default axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
