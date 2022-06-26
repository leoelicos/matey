'use strict';

const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  await User.deleteMany({});

  await Thought.deleteMany({});

  const thoughts = [];

  for (let i = 0; i < 20; i += 1) {
    const reactions = getRandomReactions(20);

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    thoughts.push({
      first,
      last,
      github,
      reactions
    });
  }

  await Thought.collection.insertMany(thoughts);

  await User.collection.insertOne(
    {
      userName: 'UCLA',
      inPerson: false,
      thoughts: thoughts.map((s) => s._id)
    },
    { new: true }
  );

  process.exit(0);
});
