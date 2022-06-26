'use strict';

// ObjectId() method for converting thoughtId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

const headCount = async () =>
  Thought.aggregate()
    .count('thoughtCount')
    .then((numberOfThoughts) => numberOfThoughts);

// Execute the aggregate method on the Thought model and calculate the overall grade by using the $avg operator
const grade = async (thoughtId) =>
  Thought.aggregate([
    {
      $match: { _id: ObjectId(thoughtId) }
    },
    {
      $unwind: '$reactions'
    },
    {
      $group: {
        _id: ObjectId(thoughtId),
        overallGrade: { $avg: '$reactions.score' }
      }
    }
  ]);

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          headCount: await headCount()
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .lean()
      .then(async (thought) => (!thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json({ thought, grade: await grade(req.params.thoughtId) })))
      .catch((err) => {
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought and remove them from the user
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => (!thought ? res.status(404).json({ message: 'No such thought exists' }) : User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true })))
      .then((user) => (!user ? res.status(404).json({ message: 'Thought deleted, but no users found' }) : res.json({ message: 'Thought successfully deleted' })))
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true })
      .then((thought) => (!thought ? res.status(404).json({ message: 'No thought found with that ID :(' }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reaction: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true })
      .then((thought) => (!thought ? res.status(404).json({ message: 'No thought found with that ID :(' }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  }
};