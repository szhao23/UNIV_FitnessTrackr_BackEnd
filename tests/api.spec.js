const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {API_URL, JWT_SECRET} = process.env;
const SALT_COUNT = 10;

const { rebuildDB, testDB } = require('../db/seedData');
const { getUserById, createActivity, updateActivity } = require('../db');
const client = require('../db/client')

// example of axios delete request
// axios.delete(`${API_URL}/api/routines/${routine.id}`, {data: { /* req body data */ }, headers: {'Authorization': `Bearer ${token}`} });

describe('API', () => {
  let token;
  beforeAll(async() => {
    await rebuildDB();
  })
  it('responds to a request at /api/health with a message specifying it is healthy', async () => {
    const res = await axios.get(`${API_URL}/api/health`);

    expect(typeof res.data.message).toEqual('string');
  });

  describe('Users', () => {
    let newUser = { username: 'robert', password: 'bobbylong321' };
    let newUserShortPassword = { username: 'robertShort', password: 'bobby21' };
    let registeredUser;
    describe('POST /users/register', () => {
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
        expect(await bcrypt.compare(newUser.password, queriedUser.password)).toBe(true);
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
      it('Logs in the user. Requires username and password, and verifies that hashed login password matches the saved hashed password.', async () => {
        const {data} = await axios.post(`${API_URL}/api/users/login`, newUser);
        token = data.token;
        expect(data.token).toBeTruthy();
      });
      it('Returns a JSON Web Token. Stores the id and username in the token.', async () => {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        expect(parsedToken.id).toEqual(registeredUser.id);
        expect(parsedToken.username).toEqual(registeredUser.username);
      });
    })
    describe('GET /users/:username/routines', () => {
      it('Gets a list of public routines for a particular user.', async () => {
        const userId = 2;
        const userWithRoutines = await getUserById(userId);
        const {data: routines} = await axios.get(`${API_URL}/api/users/${userWithRoutines}/routines`);
        expect(false).toBe(true);
      });
    });
  });
  describe('Activities', () => {
    describe('GET /activities', () => {
      it('Just returns a list of all activities in the database', async () => {
        const curls = { name: 'curls', description: '4 sets of 15.' };
        const createdActivity = await createActivity(curls);
        const {data: activities} = await axios.get(`${API_URL}/api/activities`);
        expect(Array.isArray(activities)).toBe(true);
        expect(activities.length).toBeGreaterThan(0);
        expect(activities[0].name).toBeTruthy();
        expect(activities[0].description).toBeTruthy();
        const [filteredActivity] = activities.filter(activity => activity.id === createdActivity.id);
        expect(filteredActivity.name).toEqual(curls.name);
        expect(filteredActivity.description).toEqual(curls.description);
      });
    });
    describe('POST /activities (*)', () => {
      it('Creates a new activity', async () => {
        const activity = await axios.post(`${API_URL}/api/activities`, { name: 'Bicep Curls', description: 'They hurt, but you will thank you later' }, { headers: {'Authorization': `Bearer ${token}`} });
        expect(false).toBe(true);
      });
    });
    describe('PATCH /activities/:activityId (*)', () => {
      it('Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)', async () => {
  
        expect(false).toBe(true);
      });
    });
    describe('GET /activities/:activityId/routines', () => {
      it('Get a list of all public routines which feature that activity', async () => {
  
        expect(false).toBe(true);
      });
    });
  });
});
