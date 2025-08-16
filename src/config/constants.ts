/**
 * Límite de mensajes a solicitar en cada petición de paginación.
 */
export const MESSAGE_FETCH_LIMIT = 30;

/**
 * Duración en milisegundos que un mensaje permanecerá resaltado.
 */
export const HIGHLIGHT_DURATION_MS = 2500;

/**
 * URL base para las peticiones a la API.
 */
// export const BASE_URL_API = 'https://localhost:3000/api';
export const BASE_URL_API = 'https://192.168.1.4:3000/api';

/**
 * Para desarrollo y pruebas en dispositivos móviles, define los valores para reemplazar
 * en las URLs de los archivos multimedia. El backend puede generar URLs con `localhost`,
 * que no son accesibles desde otros dispositivos en la misma red.
 * Déjalos como strings vacíos si no necesitas el reemplazo.
 */
export const MEDIA_URL_REPLACE_FROM = 'localhost:3000';
export const MEDIA_URL_REPLACE_TO = '192.168.1.4:3000';
