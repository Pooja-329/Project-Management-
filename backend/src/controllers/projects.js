const Project = require('../models/Project');


exports.getProjects = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'member') {
            query = Project.find({
                $or: [
                    { owner: req.user.id },
                    { members: { $in: [req.user.id] } }
                ]
            });
        } else {
            query = Project.find();
        }

        const projects = await query.populate('owner').populate('tasks');

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('tasks');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.createProject = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;

        const project = await Project.create(req.body);

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id && req.user.role === 'member') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
