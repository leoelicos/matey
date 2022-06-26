'use strict';

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true
    },
    inPerson: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now()
    },
    endDate: {
      type: Date,
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000)
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

const User = model('user', userSchema);

module.exports = User;
