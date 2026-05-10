import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area 
} from 'recharts';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    TrendingUp,
    Users
} from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        completedTasks: 0,
        pendingTasks: 0,
        teamSize: 0
    });
    const [loading, setLoading] = useState(true);

    const data = [
        { name: 'Mon', tasks: 4 },
        { name: 'Tue', tasks: 7 },
        { name: 'Wed', tasks: 5 },
        { name: 'Thu', tasks: 12 },
        { name: 'Fri', tasks: 9 },
        { name: 'Sat', tasks: 6 },
        { name: 'Sun', tasks: 8 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/projects');
                const projects = res.data.data;
                setStats({
                    totalProjects: projects.length,
                    completedTasks: 24,
                    pendingTasks: 12,
                    teamSize: 5
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, icon: TrendingUp, color: 'var(--primary)' },
        { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckCircle2, color: 'var(--success)' },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'var(--warning)' },
        { label: 'Team Members', value: stats.teamSize, icon: Users, color: 'var(--info)' },
    ];

    return (
        <div className="dashboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Overview</h1>
                    <p className="text-muted">Welcome back! Here's what's happening with your projects.</p>
                </div>
            </header>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card glass-card">
                        <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="chart-container glass-card">
                    <div className="chart-header">
                        <h3>Task Completion Trend</h3>
                        <p className="text-muted">Daily performance over the last week</p>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} />
                                <YAxis stroke="var(--text-dim)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="tasks" 
                                    stroke="var(--primary)" 
                                    fillOpacity={1} 
                                    fill="url(#colorTasks)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass-card">
                    <div className="chart-header">
                        <h3>Project Status Distribution</h3>
                        <p className="text-muted">Current status of all active projects</p>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} />
                                <YAxis stroke="var(--text-dim)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="tasks" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
