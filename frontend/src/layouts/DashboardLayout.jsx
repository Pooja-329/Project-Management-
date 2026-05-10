import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="header-search">
                        <input type="text" placeholder="Search projects or tasks..." className="form-input" />
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary">
                            <span>New Project</span>
                        </button>
                    </div>
                </header>
                <div className="content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
