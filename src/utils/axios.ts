import axios from 'axios';
import dotenv from 'dotenv';

import { HOST } from './constants';

// Load environment variables from .env file
dotenv.config();

const axiosInstance = process.env['SESSION']
  ? axios.create({
      baseURL: HOST,
      headers: {
        cookie: `session=${process.env['SESSION']};`,
      },
    })
  : null;

export default axiosInstance;
