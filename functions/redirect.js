const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

exports.handler = async (event, context) => {
  const { shortId } = event.pathParameters;

  try {
    const res = await pool.query(
      "SELECT originalUrl FROM urls WHERE shortId = $1",
      [shortId]
    );

    if (res.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "URL not found" }),
      };
    }

    const originalUrl = res.rows[0].originalUrl;

    return {
      statusCode: 302,
      headers: {
        Location: originalUrl,
      },
      body: JSON.stringify({ message: "Redirecting" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
