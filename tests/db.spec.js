const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {API_URL} = process.env;
const SALT_COUNT = 10;

const { rebuildDB, testDB } = require('../db/seedData');
const { getUserById, getAllActivities, createActivity, updateActivity } = require('../db');
const client = require('../db/client')

describe('Database', () => {
  beforeAll(async() => {
    await rebuildDB();
  })
  describe('getUserById', () => {
    it('getUserById', async () => {
      const user = await getUserById(1);
      expect(user).toBeTruthy();
    })
  })
  describe('updateActivity', () => {
    it('Updates name and description of an activity without affecting the ID. Returns the updated Activity.', async () => {
      const [activityToUpdate] = await getAllActivities();
      activityToUpdate.name = 'standing barbell curl';
      const activity = await updateActivity(activityToUpdate);
      delete activity.id;
      expect(activity).toEqual(activityToUpdate);
    })
  })
});
