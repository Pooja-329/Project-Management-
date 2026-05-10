import { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal,
    MessageSquare,
    Paperclip,
    Clock,
    X
} from 'lucide-react';
import api from '../api/axios';
import './TaskBoard.css';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: ''
    });

    const columns = [
        { id: 'todo', title: 'To Do', color: 'var(--text-dim)' },
        { id: 'in-progress', title: 'In Progress', color: 'var(--primary)' },
        { id: 'review', title: 'Review', color: 'var(--warning)' },
        { id: 'done', title: 'Done', color: 'var(--success)' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, projectsRes] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/projects')
                ]);
                setTasks(tasksRes.data.data);
                setProjects(projectsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-dim)';
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.project || !newTask.title || !newTask.description) {
            alert('Please fill in all fields');
            return;
        }
        try {
            await api.post(`/projects/${newTask.project}/tasks`, newTask);
            setIsModalOpen(false);
            setNewTask({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                project: ''
            });
            // Refetch tasks
            const res = await api.get('/tasks');
            setTasks(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Failed to create task');
        }
    };

    return (
        <div className="taskboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Task Board</h1>
                    <p className="text-muted">Manage your workload across different stages.</p>
                </div>
                <div className="board-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="btn btn-outline">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </div>
            </header>

            <div className="kanban-board">
                {columns.map(column => (
                    <div key={column.id} className="kanban-column">
                        <div className="column-header">
                            <div className="column-title">
                                <span className="status-dot" style={{ background: column.color }}></span>
                                <h3>{column.title}</h3>
                                <span className="task-count">{tasks.filter(t => t.status === column.id).length}</span>
                            </div>
                            <button className="icon-btn"><MoreHorizontal size={18} /></button>
                        </div>

                        <div className="column-body">
                            {tasks.filter(t => t.status === column.id).map(task => (
                                <div key={task._id} className="task-card glass-card">
                                    <div className="task-card-header">
                                        <span className="priority-badge" style={{ color: getPriorityColor(task.priority), background: `${getPriorityColor(task.priority)}20` }}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    
                                    <div className="task-card-footer">
                                        <div className="task-meta">
                                            <div className="meta-item">
                                                <Clock size={14} />
                                                <span>2 days left</span>
                                            </div>
                                        </div>
                                        <div className="assignees">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" className="mini-avatar" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-task-btn">
                                <Plus size={18} />
                                <span>Add Task</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Creation Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Task</h2>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="task-form">
                            <div className="form-group">
                                <label htmlFor="project">Project *</label>
                                <select
                                    id="project"
                                    className="form-input"
                                    value={newTask.project}
                                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Task Title *</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter task title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    className="form-input"
                                    placeholder="Enter task description"
                                    rows="3"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        className="form-input"
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="priority">Priority</label>
                                    <select
                                        id="priority"
                                        className="form-input"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
