import { useState, useEffect } from 'react';
import { 
    UserPlus, 
    Mail, 
    Shield, 
    MoreVertical,
    Check,
    X
} from 'lucide-react';
import api from '../api/axios';
import './Team.css';

const Team = () => {
    const [members, setMembers] = useState([
        { id: 1, name: 'Alex Johnson', email: 'alex@company.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        { id: 2, name: 'Sarah Williams', email: 'sarah@company.com', role: 'manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: 3, name: 'Michael Chen', email: 'michael@company.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    ]);

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'var(--danger)';
            case 'manager': return 'var(--primary)';
            case 'member': return 'var(--success)';
            default: return 'var(--text-dim)';
        }
    };

    return (
        <div className="team-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Team Management</h1>
                    <p className="text-muted">Manage your organization's members and their roles.</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} />
                    <span>Invite Member</span>
                </button>
            </header>

            <div className="team-list glass-card">
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td>
                                    <div className="member-info">
                                        <img src={member.avatar} alt={member.name} className="member-avatar" />
                                        <span>{member.name}</span>
                                    </div>
                                </td>
                                <td>{member.email}</td>
                                <td>
                                    <span className="role-badge" style={{ color: getRoleBadgeColor(member.role), background: `${getRoleBadgeColor(member.role)}20` }}>
                                        <Shield size={12} />
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className="status-active">
                                        <Check size={12} /> Active
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn"><MoreVertical size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Team;
