import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
