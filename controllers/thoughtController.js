'use strict';

const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .select('-__v')
      .then(async (thoughts) => {
        res.json(thoughts);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) => (!thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought)))
      .catch((err) => {
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)

      .then((thought) => {
        return User.findOneAndUpdate(
          // find user that matches the username
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
          .select('-__v')
          .populate('thoughts');
      })
      .then((user) =>
        !user
          ? // no user
            res.status(404).json({ message: 'Thought created, but found no user with that username' })
          : res.json({ message: 'Success!', user })
      )
      .catch((err) => res.status(500).json(err));
  },
  async updateThought(req, res) {
    const user = await User.findOne({ username: req.body.username }).exec();

    if (!user) {
      res.status(404).json('username does not exist');
      return;
    }

    Thought.findOneAndUpdate(
      // find thought that matches the parameter
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => (!thought ? res.status(404).json({ message: 'No thought with this id!' }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought and remove them from the user
  async deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? // if no thought found, return error message
            res.status(404).json({ message: 'No such thought exists' })
          : // otherwise, update the user
            User.findOneAndUpdate(
              // find user with username that matches
              { username: thought.username },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) => (!user ? res.status(404).json({ message: 'Thought deleted, but no users found' }) : res.json({ message: 'Thought successfully deleted' })))
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    // check if the friend exists in user database
    const friend = await User.findOne({ _id: req.params.friendId }).exec();

    if (!friend) {
      res.status(404).json('friend does not exist');
      return;
    }

    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true })
      .then((thought) => (!thought ? res.status(404).json({ message: 'No thought found with that ID :(' }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  },

  // Remove reaction from a thought
  async removeReaction(req, res) {
    // check if the friend exists in user database
    const friend = await User.findOne({ _id: req.params.friendId }).exec();

    if (!friend) {
      res.status(404).json('friend does not exist');
      return;
    }

    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reaction: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true })
      .then((thought) => (!thought ? res.status(404).json({ message: 'No thought found with that ID :(' }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  }
};
