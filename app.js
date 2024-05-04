import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

// Leer un JSON  en ESModules
// import fs from 'node:fs';
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

const app = express();
app.disable('x-powered-by');
app.use(json());
app.use(corsMiddleware());


app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});