import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Calendar, Users, Trash2, Edit } from 'lucide-react';
import api from '../api/axios';
import './Projects.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', status: 'planning' });

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', newProject);
            setIsModalOpen(false);
            setNewProject({ title: '', description: '', status: 'planning' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'var(--success)';
            case 'in-progress': return 'var(--primary)';
            case 'on-hold': return 'var(--warning)';
            default: return 'var(--text-dim)';
        }
    };

    return (
        <div className="projects-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p className="text-muted">Manage and track all your active initiatives.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </header>

            {loading ? (
                <div className="loading-state">Loading projects...</div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div key={project._id} className="project-card glass-card">
                            <div className="project-card-header">
                                <span className="status-badge" style={{ background: `${getStatusColor(project.status)}20`, color: getStatusColor(project.status) }}>
                                    {project.status.replace('-', ' ')}
                                </span>
                                <button className="icon-btn" onClick={() => handleDelete(project._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3>{project.title}</h3>
                            <p className="project-desc">{project.description}</p>
                            
                            <div className="project-meta">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-item">
                                    <Users size={14} />
                                    <span>{project.members?.length || 0} Members</span>
                                </div>
                            </div>

                            <div className="project-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '45%' }}></div>
                                </div>
                                <span>45%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Create New Project</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Project Title</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    required
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
