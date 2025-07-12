import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

var backendApiIstance = axios.create({
  baseURL: process.env.BACKEND_API_ENDPOINT,
  withCredentials: true,
});

export default backendApiIstance;
