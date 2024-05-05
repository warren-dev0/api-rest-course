import { randomUUID } from 'node:crypto';
import { readJSON } from '../../utils.js';
const movies = readJSON('./movies.json');

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            return moviesRouter.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        }
        return movies;
    };

    static async getById({ id }) {
        const movie = movies.find(movie => movie.id === id)
        return movie;
    };

    static async create({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        }

        // Esto no sería REST, porque estamos guardando
        // el estado de la aplicación en memoria
        movies.push(newMovie);

        return newMovie;

    };

    static async update({ id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id === id);

        if (movieIndex === -1) return false;

        const updateMovie = {
            ...movies[movieIndex],
            ...input
        }

        movies[movieIndex] = updateMovie;

        return movies[movieIndex];
    };

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id);

        if (movieIndex === -1) return false;

        movies.splice(movieIndex, 1);

        return true;
    };

}