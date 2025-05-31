import pg, { PoolConfig } from "pg";
const { Pool } = pg;

const sslCert = process.env.DB_SSL_CERT;

const poolConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
};

const pool = new Pool({
  ...poolConfig,
  ssl: {
    rejectUnauthorized: false,
    ca: sslCert,
  },
});

type QueryResult<T> = {
  success: boolean;
  data: Array<T> | null;
  count: number | null;
};

export const query = async <T>(
  text: string,
  params: Array<unknown> = []
): Promise<QueryResult<T>> => {
  try {
    const result = await pool.query(text, params);

    return {
      success: true,
      data: result.rows as T[],
      count: result.rowCount,
    };
  } catch (error) {
    console.log(text);
    console.error(error);
    return {
      success: false,
      data: [],
      count: 0,
    };
  }
};
