import { User, Thought } from '../models/index.js'

const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().select('-__v')
    await res.status(200).json(thoughts)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v')

    if (!thought) {
      const message = 'No thought with that ID'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    await res.status(200).json(thought)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body)

    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $addToSet: { thoughts: thought._id } },
      { new: true } //
    )
      .select('-__v')
      .populate('thoughts')

    if (!user) {
      const message = 'Success, but found no user with that username'
      console.warn(message)
      res.status(200).json({ message, user, thought })
      return
    }

    res.status(200).json({ message: 'Success!', user, thought })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true } //
    )

    if (!thought) {
      const message = 'Rejected. No thought with this id!'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      const message = 'Success, but username does not exist'
      console.warn(message)
      res.status(200).json(message, thought)
      return
    }

    res.status(200).json({ message: 'Success', thought })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const deleteThought = async (req, res) => {
  try {
    const _id = req.params.thoughtId
    const thought = await Thought.findOneAndRemove({ _id })

    if (!thought) {
      const message = 'No such thought exists'
      console.error('message')
      res.status(404).json({ message })
      return
    }

    const user = await User.findOneAndUpdate(
      { username: thought.username },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true } //
    )

    if (!user) {
      const message = 'Thought deleted, but no users found'
      console.warn(message)
      res.status(200).json({ message })
      return
    }

    res.status(200).json({ message: 'Thought successfully deleted' })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const addReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true } //
    )
      .select('-__v')
      .populate('reactions')

    if (!thought) {
      const message = 'No thought with that id'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    res.json({ message: 'Success!', thought })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const removeReaction = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v').populate('reactions')

    if (!thought) {
      const message = 'No thought with that id'
      console.error(message)
      res.status(404).json({ message })
      return
    }

    const ids = thought.reactions.map(({ _id }) => _id.toString())
    if (!ids.includes(req.params.reactionId)) console.log(ids)

    res.json({ message: 'Reaction successfully deleted', thought })
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

export { getThoughts, getSingleThought, createThought, updateThought, deleteThought, addReaction, removeReaction }
