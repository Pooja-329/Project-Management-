const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/tasks');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getTasks)
    .post(createTask);

router
    .route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
