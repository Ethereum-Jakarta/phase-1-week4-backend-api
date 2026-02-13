import express from 'express';
import { status } from 'http-status';
import routes from './routes/index.js';
import morgan from './config/morgan.js';
import config from './config/config.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import rateLimiter from './config/rateLimiter.js';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

//set security HTTP Headers
app.use(helmet());

//aktifin parsing json
app.use(express.json());

//aktifin urlencoded
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(xss());

//gzip compression
app.use(compression());

//enable cors
app.use(cors());
app.options('*', cors());

//rate limiter enable
app.use('/api', rateLimiter);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.use('/api', routes);

//send 404 error jika route tidak ada
app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, 'Not Found'));
});

//convert error jadi Instance Api Error jika ada error yang tidak ke tangkap
app.use(errorConverter);

//handle error
app.use(errorHandler);

export default app;
