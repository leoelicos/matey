import { User, Thought } from '../models/index.js'

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v').populate({
      path: 'thoughts',
      select: '-__v'
    })

    res.status(200).json(users)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }) //
      .select('-__v')
      .populate({
        path: 'thoughts',
        select: '-__v'
      })

    if (!user) {
      const message = 'No user with that ID'
      console.error(message)
      res.status(404).json({ message })
      return
    }
    res.status(200).json(user)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(200).json({ message: 'Success!', user })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.userId
    })

    if (!user) {
      const message = 'No user with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    const response = await Thought.deleteMany({
      _id: { $in: user.thoughts }
    })

    res.status(200).json({ message: 'User and thoughts deleted!', response })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })

    if (!user) {
      const message = 'No user with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    res.status(200).json(user)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const addFriend = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })

    if (!user) {
      const message = 'No user with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    const existingFriends = user.friends.map((_id) => _id.toString())

    if (existingFriends.includes(req.params.friendId)) {
      const message = 'Already friends!'
      console.log({
        message,
        existingFriends,
        friendId: req.params.friendId
      })
      res.status(200).json({
        message,
        existingFriends,
        friendId: req.params.friendId
      })
      return
    }

    await user.updateOne(
      { $addToSet: { friends: req.params.friendId } },
      { new: true } //
    )

    const friend = await User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $addToSet: { friends: req.params.userId } },
      { new: true } //
    )

    if (!friend) {
      const message = 'No friend with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    res.status(200).json({ message: 'Success', user })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}
const removeFriend = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })

    if (!user) {
      const message = 'No user with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    const existingFriends = user.friends
    if (!existingFriends.includes(req.params.friendId)) {
      const message = 'Not currently friends!'
      console.log({
        message,
        existingFriends,
        friendId: req.params.friendId
      })
      res.status(200).json({
        message,
        existingFriends,
        friendId: req.params.friendId
      })
      return
    }

    await user.updateOne(
      { $pull: { friends: req.params.friendId } },
      { new: true } //
    )

    const friend = await User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $pull: { friends: req.params.userId } },
      { new: true } //
    )

    if (!friend) {
      const message = 'No friend with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    res.status(200).json({ message: 'success', user })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

export { getUsers, getSingleUser, createUser, deleteUser, updateUser, addFriend, removeFriend }
