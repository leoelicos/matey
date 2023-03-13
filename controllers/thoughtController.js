import { User, Thought } from '../models/index.js'

export function getThoughts(req, res) {
  Thought.find()
    .select('-__v')
    .then(async (thoughts) => {
      res.json(thoughts)
    })
    .catch((err) => {
      return res.status(500).json(err)
    })
}
export function getSingleThought(req, res) {
  Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then(async (thought) => (!thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought)))
    .catch((err) => {
      return res.status(500).json(err)
    })
}
export function createThought(req, res) {
  Thought.create(req.body)

    .then((thought) => {
      return User.findOneAndUpdate(
        // find user that matches the username
        { username: req.body.username },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      )
        .select('-__v')
        .populate('thoughts')
    })
    .then((user) =>
      !user
        ? // no user
          res.status(404).json({ message: 'Thought created, but found no user with that username' })
        : res.json({ message: 'Success!', user })
    )
    .catch((err) => res.status(500).json(err))
}
export async function updateThought(req, res) {
  const user = await User.findOne({ username: req.body.username }).exec()

  if (!user) {
    res.status(404).json('username does not exist')
    return
  }

  Thought.findOneAndUpdate(
    // find thought that matches the parameter
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((thought) => (!thought ? res.status(404).json({ message: 'No thought with this id!' }) : res.json(thought)))
    .catch((err) => res.status(500).json(err))
}
export // Delete a thought and remove them from the user
async function deleteThought(req, res) {
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
      res.status(500).json(err)
    })
}
export // Add a reaction to a thought
async function addReaction(req, res) {
  Thought.findOneAndUpdate(
    // find user that matches the username
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { new: true }
  )
    .select('-__v')
    .populate('reactions')
    .then((thought) =>
      !thought
        ? // no thought
          res.status(404).json({ message: 'Reaction created, but found no thought with that id' })
        : res.json({ message: 'Success!', thought })
    )
    .catch((err) => res.status(500).json(err))
}
export // Remove reaction from a thought
async function removeReaction(req, res) {
  Thought.findOneAndUpdate(
    // find thought with id that matches thoughtId
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { new: true }
  )
    .select('-__v')
    .populate('reactions')
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'Reaction deleted, but no thoughts found' }) // success message
        : res.json({ message: 'Reaction successfully deleted' })
    )
    .catch((err) => res.status(500).json(err))
}
