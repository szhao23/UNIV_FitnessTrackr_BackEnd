const axios = require('axios');
require('dotenv').config();
const {API_URL} = process.env;

const { rebuildDB, testDB } = require('../db/seedData');
const { client, getUserById } = require('../db/index');

describe('Application', () => {
  beforeAll(async() => {
    await rebuildDB();
  })
  describe('Server', () => {
    // perform login before these routes
    // let token = '';

    // beforeAll - runs once before all below tests
    // beforeEach(async () => {
    //   const res = await login();

    //   token = res.token;
    // });

    it('responds to a request at /api/health with a message specifying it is healthy', async () => {
      const res = await axios.get(`${API_URL}/api/health`);

      expect(typeof res.data.message).toEqual('string');
    });

  });
  describe('Users', () => {
    let newUser = { username: 'robert', password: 'bobbylong321' };
    let newUserShortPassword = { username: 'robertShort', password: 'bobby21' };
    describe('Login', () => {
      describe('POST /users/register', () => {
        let registeredUser;
        let tooShortResponse;
        beforeAll(async() => {
          const successResponse = await axios.post(`${API_URL}/api/users/register`, newUser);
          registeredUser = successResponse.data.user;
          tooShortResponse = await axios.post(`${API_URL}/api/users/register`, newUserShortPassword);
        })
        it('Creates a new user.', () => {
          expect(typeof registeredUser).toEqual('object');
          expect(registeredUser.username).toEqual(newUser.username);
        });
        it('Requires username and password. Requires all passwords to be at least 8 characters long.', () => {
          expect(newUser.password.length).toBeGreaterThan(7);
        });
        it('Hashes password before saving user to DB.', async () => {
          const {rows: [queriedUser]} = await client.query(`
            SELECT *
            FROM users
            WHERE id = $1;
          `, [registeredUser.id]);
          expect(queriedUser.password).not.toBe(newUser.password);
        });
        it('Throw errors for duplicate username', async () => {
          const duplicateResponse = await axios.post(`${API_URL}/api/users/register`, newUser);
          expect(duplicateResponse.data.message).toBe('A user by that username already exists');
        });
        it('Throw errors for password-too-short.', async () => {
          expect(tooShortResponse.data.message).toBe('Password Too Short!');
        });
      });
      describe('POST /users/login', () => {
        it('Logs in the user. Requires username and password, and verifies that plaintext login password matches the saved hashed password before returning a JSON Web Token.', async () => {
          expect(false).toBe(true);
        });
        it('Stores the id and username in the token.', async () => {
          expect(false).toBe(true);
        });
      })
      describe('GET /users/:username/routines', () => {
        it('Gets a list of public routines for a particular user.', async () => {
          expect(false).toBe(true);
        });
      });
    });
  });
  
});
