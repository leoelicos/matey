import connection from '../config/connection.js'
import { Thought, User } from '../models/index.js'
import data from './data.js'

connection.on('error', (err) => err)

connection.once('open', async () => {
  try {
    await Thought.deleteMany()
    await User.deleteMany()

    // create users
    const userInserts = await Promise.all(
      data.map((x) =>
        User.collection.insertOne({
          username: x.username,
          email: x.email
        })
      )
    )
    const userIds = userInserts.map((v) => v.insertedId)

    // add each other as friends
    await Promise.all(
      userIds.map(async (userId, i) => {
        let friends = userIds.filter((id) => id !== userId)

        // add friends to me
        await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { friends: friends } } //
        )

        // add me to friends
        await Promise.all(
          friends.map((friendId) =>
            User.findOneAndUpdate(
              { _id: friendId },
              { $addToSet: { friends: userId } } //
            )
          )
        )
      })
    )

    // add thoughts and reactions
    await Promise.all(
      data.map(async ({ thoughts, username }) => {
        await Promise.all(
          thoughts.map(async ({ thoughtText, reactions }) => {
            const thoughtId = await Thought.create({
              username,
              thoughtText,
              reactions
            })
            await User.findOneAndUpdate(
              { username },
              { $addToSet: { thoughts: thoughtId } } //
            )
          })
        )
      })
    )

    console.info('Seeding complete! 🌱')
  } catch (e) {
    console.error(e)
  } finally {
    connection.close()
    process.exit(0)
  }
})
