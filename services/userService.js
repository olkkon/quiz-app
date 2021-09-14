import { executeQuery } from "../database/database.js";

const addUser = async (email, hash) => {
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    email,
    hash,
  );
};

const deleteUser = async (id) => {
  await executeQuery(
    "DELETE FROM users WHERE id = $1",
    id,
  );
};

const findByEmail = async (email) => {
  const res = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );
  return res.rows;
};

export { addUser, deleteUser, findByEmail };
