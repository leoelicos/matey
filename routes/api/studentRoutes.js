'use strict';

const router = require('express').Router();
const { getStudents, getSingleStudent, createStudent, deleteStudent, addReaction, removeReaction } = require('../../controllers/studentController');

// /api/students
router.route('/').get(getStudents).post(createStudent);

// /api/students/:studentId
router.route('/:studentId').get(getSingleStudent).delete(deleteStudent);

// /api/students/:studentId/reactions
router.route('/:studentId/reactions').post(addReaction);

// /api/students/:studentId/reactions/:reactionId
router.route('/:studentId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
