const { client } = require('./');
const { rebuildDB, testDB } = require('./seedData');

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
