const { client } = require('./');



const testDB = async () => {
  try {
    console.log('Running testDB');

    console.log('Finished DB Tests');
  } catch (error) {
    throw new Error('Error Testing Database: ', error)
  }
}
testDB();