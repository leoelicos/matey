const data = [
  {
    username: 'harry',
    email: 'harry@hogwarts.com',
    thoughts: [
      {
        thoughtText: 'Magic is fun',
        reactions: [
          {
            reactionBody: 'Yes it is',
            username: 'hermione'
          },
          {
            reactionBody: "No it isn't",
            username: 'ron'
          }
        ]
      }
    ]
  },
  {
    username: 'ron',
    email: 'ron@hogwarts.com',
    thoughts: [
      {
        thoughtText: 'Frogs are fun',
        reactions: [
          {
            reactionBody: "No they're not",
            username: 'hermione'
          },
          {
            reactionBody: 'Yes they are',
            username: 'harry'
          }
        ]
      }
    ]
  },
  {
    username: 'hermione',
    email: 'hermione@hogwarts.com',
    thoughts: [
      {
        thoughtText: 'School is fun',
        reactions: [
          {
            reactionBody: "No it isn't",
            username: 'harry'
          },
          {
            reactionBody: 'It most certainly is not',
            username: 'ron'
          }
        ]
      }
    ]
  }
]
export default data
