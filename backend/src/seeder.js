const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const manager = await User.create({
            name: 'Project Manager',
            email: 'manager@example.com',
            password: 'password123',
            role: 'manager'
        });

        const project1 = await Project.create({
            title: 'Website Redesign',
            description: 'Redesigning the corporate website with a modern aesthetic.',
            status: 'in-progress',
            owner: manager._id,
            members: [admin._id]
        });

        await Task.create([
            {
                title: 'Design Mockups',
                description: 'Create high-fidelity mockups for the homepage.',
                status: 'done',
                priority: 'high',
                project: project1._id,
                assignedTo: manager._id
            },
            {
                title: 'Frontend Implementation',
                description: 'Build the React components based on the mockups.',
                status: 'in-progress',
                priority: 'medium',
                project: project1._id,
                assignedTo: manager._id
            },
            {
                title: 'Backend Integration',
                description: 'Connect the frontend to the REST API.',
                status: 'todo',
                priority: 'high',
                project: project1._id,
                assignedTo: admin._id
            }
        ]);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
