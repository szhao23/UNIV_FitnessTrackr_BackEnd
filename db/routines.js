const client = require('./client')

async function getAllRoutines() {
  const { rows } = await client.query(`SELECT * FROM routines;`);
  return rows;
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows} = await client.query(`
        INSERT INTO routines ("creatorId", "public", "name", "goal")
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllRoutines,
  createRoutine,
}