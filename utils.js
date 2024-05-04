// Leer un JSON en ESModules recomendado en la actualidad
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (path => require(path));