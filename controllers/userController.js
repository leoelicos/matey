import { User, Thought } from '../models'

export function getUsers(req, res) {
  User.find()
    .select('-__v')
    .populate('thoughts')
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err))
}
export function getSingleUser(req, res) {
  User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('thoughts')
    .then((user) => (!user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)))
    .catch((err) => res.status(500).json(err))
}
export function createUser(req, res) {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => {
      return res.status(500).json(err)
    })
}
export function deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => (!user ? res.status(404).json({ message: 'No user with that ID' }) : Thought.deleteMany({ _id: { $in: user.thoughts } })))
    .then(() => res.json({ message: 'User and thoughts deleted!' }))
    .catch((err) => res.status(500).json(err))
}
export function updateUser(req, res) {
  User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
    .then((user) => (!user ? res.status(404).json({ message: 'No user with this id!' }) : res.json(user)))
    .catch((err) => res.status(500).json(err))
}
export function addFriend(req, res) {
  User.findOneAndUpdate(
    // find user by userId
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user found with that ID :(' })
        : // also add the user to the friend's friend list
          User.findOneAndUpdate(
            // find friend by friendId
            { _id: req.params.friendId },
            { $addToSet: { friends: req.params.userId } },
            { new: true }
          )
    )
    .then((user) => (!user ? res.status(404).json({ message: 'No friend found with that ID :(' }) : res.json(user)))
    .catch((err) => res.status(500).json(err))
}
export function removeFriend(req, res) {
  User.findOneAndUpdate(
    // find user by userId
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user found with that ID :(' })
        : // also remove the user from the friend's friend list
          User.findOneAndUpdate(
            // find friend by friendId
            { _id: req.params.friendId },
            { $pull: { friends: req.params.userId } },
            { new: true }
          )
    )
    .then((user) => (!user ? res.status(404).json({ message: 'No user found with that ID :(' }) : res.json(user)))
    .catch((err) => res.status(500).json(err))
}
