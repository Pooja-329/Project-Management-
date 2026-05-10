const Task = require('../models/Task');
const Project = require('../models/Project');


exports.getTasks = async (req, res, next) => {
    try {
        let query;

        if (req.params.projectId) {
            query = Task.find({ project: req.params.projectId });
        } else {
            query = Task.find().populate({
                path: 'project',
                select: 'title'
            });
        }

        const tasks = await query;

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.createTask = async (req, res, next) => {
    try {
        req.body.project = req.params.projectId;
        
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const task = await Task.create(req.body);

        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await task.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
