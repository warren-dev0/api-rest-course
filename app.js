const express = require('express');
const crypto = require('node:crypto');
const cors = require('cors');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');

const app = express();

app.disable('x-powered-by');

app.use(express.json());

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// en los métodos complejos, existe un CORS PRE-Flight
// este pre-flight contiene OPTIONS

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGIN = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com'
        ]

        if(ACCEPTED_ORIGIN.includes(origin)) return callback(null, true);

        if(!origin) return callback(null, true);

        return callback(new Error('The origin is not allowed'));
    }
}))


app.get('/movies', (req, res) => {

    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    }
    res.json(movies);
});

// el :id es un segmento dinámico en la ruta
app.get('/movies/:id', (req, res) => {

    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);

    res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // En base de datos
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie);

    res.status(201).json(newMovie) // actualizar la cache del cliente
});

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) });

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;

    return res.json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {

    const { id } = req.params;

    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    movies.splice(movieIndex, 1);

    return res.json({ message: 'Movie deleted' });
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});