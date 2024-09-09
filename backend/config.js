export const db = {
  user: process.env.DB_USER || 'grupo2',
  password: process.env.DB_PASSWORD || 'grupo2',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5475,
  database: process.env.DB_DATABASE || 'baseInventario'
};

export const port = process.env.PORT || 4000;
