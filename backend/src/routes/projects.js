const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projects');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(createProject);

router
    .route('/:id')
    .get(getProject)
    .put(authorize('admin', 'manager'), updateProject)
    .delete(authorize('admin', 'manager'), deleteProject);

module.exports = router;
