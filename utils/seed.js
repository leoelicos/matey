'use strict';

const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  await User.deleteMany({});

  await Thought.deleteMany({});

  const thoughts = [];

  for (let i = 0; i < 2; i += 1) {
    const thoughtText = getRandomReactions(2);
    const reactions = getRandomReactions(2);

    thoughts.push({ thoughtText, reactions });
  }

  await Thought.collection.insertMany(thoughts);

  User.collection.insertOne(
    {
      username: 'harrypotter',
      email: 'hp@hogwarts.com',
      thoughts: thoughts.map((s) => s._id)
    },
    { new: true }
  );

  process.exit(0);
});
