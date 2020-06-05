const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {API_URL} = process.env;
const SALT_COUNT = 10;

const { rebuildDB, testDB } = require('../db/seedData');
const { getUserById, getAllActivities, getActivityById, createActivity, updateActivity, getRoutineById, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, deleteRoutine } = require('../db');
const client = require('../db/client');

describe('Database', () => {
  beforeAll(async() => {
    await rebuildDB();
  })
  describe('Users', () => {
    describe('getUserById', () => {
      it('getUserById', async () => {
        const user = await getUserById(1);
        expect(user).toBeTruthy();
      })
    })
  })
  describe('Activities', () => {
    describe('updateActivity', () => {
      it('Updates name and description of an activity without affecting the ID. Returns the updated Activity.', async () => {
        const [activityToUpdate] = await getAllActivities();
        activityToUpdate.name = 'standing barbell curl';
        const activity = await updateActivity(activityToUpdate);
        delete activity.id;
        expect(activity).toEqual(activityToUpdate);
      })
    })
  })
  describe('Routines', () => {
    let routineToCreateAndUpdate;
    describe('getActivityById', () => {
      it('gets activities by their id', async () => {
        const activity = await getActivityById(1);
        expect(activity).toBeTruthy();
      })
    })
    describe('getAllRoutines', () => {
      it('selects and returns an array of all routines, includes their activities', async () => {
        const [routine] = await getAllRoutines();
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
      })
    })
    describe('getAllPublicRoutines', () => {
      it('selects and returns an array of all public routines, includes their activities', async () => {
        const [routine] = await getAllPublicRoutines();
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.public).toBe(true);
      })
    })
    describe('getAllRoutinesByUser', () => {
      it('selects and return an array of all routines made by user, includes their activities', async () => {
        const user = await getUserById(1); 
        const [routine] = await getAllRoutinesByUser(user);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
      })
    })
    describe('getPublicRoutinesByUser', () => {
      it('selects and returns an array of all routines made by user, includes their activities', async () => {
        const user = await getUserById(2); 
        const [routine] = await getPublicRoutinesByUser(user);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
        expect(routine.public).toBe(true);
      })
    })
    describe('getPublicRoutinesByActivity', () => {
      it('selects and return an array of public routines which have a specific activityId in their routine_activities join, includes their activities', async () => {
        const activity = await getActivityById(3); 
        const [routine] = await getPublicRoutinesByActivity(activity);
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        // expect(routine.creatorId).toBe(activity.id);
        expect(routine.public).toBe(true);
      })
    })
    describe('createRoutine', () => {
      it('creates and returns the new routine', async () => {
        routineToCreateAndUpdate = await createRoutine({creatorId: 2, public: true, name: 'BodyWeight Day', goal: 'Do workouts that can be done from home, no gym or weights required.'});
        const queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id)
        expect(routineToCreateAndUpdate).toEqual(queriedRoutine);
      })
    })
    describe('updateRoutine', () => {
      let queriedRoutine;
      beforeAll(async() => {
        routineToCreateAndUpdate = await updateRoutine({id: routineToCreateAndUpdate.id, public: false, name: 'Arms Day', goal: 'Do all workouts that work those arms!'});
        queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id);
      })
      it('Returns the updated routine', async () => {
        expect(routineToCreateAndUpdate).toBeTruthy();
      })
      it('Finds the routine with id equal to the passed in id. Does not update the routine id.', async () => {
        expect(routineToCreateAndUpdate.id).toBe(queriedRoutine.id);
      })
      it('Updates the public status, name, or goal, as necessary', async () => {
        expect(routineToCreateAndUpdate.public).toBe(queriedRoutine.public);
        expect(routineToCreateAndUpdate.name).toBe(queriedRoutine.name);
        expect(routineToCreateAndUpdate.goal).toBe(queriedRoutine.goal);
      })
      
    })
    describe('updateRoutine', () => {
      it('remove routine from database', async () => {
        await deleteRoutine(routineToCreateAndUpdate.id);
        const {rows: [routine]} = await client.query(`
          SELECT * 
          FROM routines
          WHERE id = $1;
        `, [routineToCreateAndUpdate.id]);
        expect(routine).toBeFalsy();
      })
      
    })
  })
});
