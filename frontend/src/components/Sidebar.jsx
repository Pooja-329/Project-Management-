import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Briefcase, 
    CheckSquare, 
    Users, 
    Settings, 
    LogOut,
    PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Projects', path: '/projects' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ icon: Users, label: 'Team', path: '/team' });
    }

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <Briefcase size={24} color="var(--primary)" />
                </div>
                <span className="brand-name">ProManager</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src={user?.avatar} alt={user?.name} className="user-avatar" />
                    <div className="user-info">
                        <p className="user-name">{user?.name}</p>
                        <p className="user-role">{user?.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
