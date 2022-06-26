'use strict';

const connection = require('../config/connection');
const { Course, Student } = require('../models');
const { getRandomName, getRandomReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  await Course.deleteMany({});

  await Student.deleteMany({});

  const students = [];

  for (let i = 0; i < 20; i += 1) {
    const reactions = getRandomReactions(20);

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    students.push({
      first,
      last,
      github,
      reactions
    });
  }

  await Student.collection.insertMany(students);

  await Course.collection.insertOne(
    {
      courseName: 'UCLA',
      inPerson: false,
      students: students.map((s) => s._id)
    },
    { new: true }
  );

  process.exit(0);
});
