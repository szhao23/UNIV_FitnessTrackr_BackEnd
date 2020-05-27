const axios = require('axios');
require('dotenv').config();
const {API_URL} = process.env;

describe('Application', () => {
  describe('Users', () => {
    let user = { username: 'albert', password: 'bertie99' };
    describe('Login', () => {
      describe('POST /users/register', () => {
        let registeredUser;
        beforeAll(async() => {
          const {username, password} = user;
          const successResponse = await axios.post(`${API_URL}/api/users/register`, {username, password});
          registeredUser = successResponse.data;
          console.log('>>>>>>>>> REGISTER registeredUser', registeredUser);
        })
        it('Creates a new user.', async () => {
          expect(typeof registeredUser).toEqual('object');
          expect(registeredUser.username).toEqual(user.username);
        });
        it('Requires username and password. Requires all passwords to be at least 8 characters long.', async () => {
          expect(false).toBe(true);
        });
        it('Hashes password before saving user to DB.', async () => {
          expect(false).toBe(true);
        });
        it('Throw errors for duplicate username, or password-too-short.', async () => {
          expect(false).toBe(true);
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
});
