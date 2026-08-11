import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    ShieldCheck,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
    return (
        <aside className="sidebar">

            {/* ================================
                BRAND
            ================================= */}

            <div className="sidebar-brand">

                <div className="brand-icon">
                    <ShieldCheck size={22} />
                </div>

                <div>
                    <h2>Aura Engine</h2>
                    <span>Enterprise Platform</span>
                </div>

            </div>

            {/* ================================
                NAVIGATION
            ================================= */}

            <nav className="sidebar-nav">

                <p className="nav-label">
                    MAIN MENU
                </p>

                {/* COMMAND CENTER */}

                <button
                    className={`nav-item ${
                        activePage === "dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("dashboard")
                    }
                >
                    <LayoutDashboard size={19} />

                    <span>
                        Command Center
                    </span>
                </button>

                {/* INVENTORY */}

                <button
                    className={`nav-item ${
                        activePage === "inventory"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("inventory")
                    }
                >
                    <Package size={19} />

                    <span>
                        Inventory
                    </span>
                </button>

                {/* ANALYTICS */}

                <button
                    className={`nav-item ${
                        activePage === "analytics"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("analytics")
                    }
                >
                    <BarChart3 size={19} />

                    <span>
                        Analytics
                    </span>
                </button>

                {/* ================================
                    SYSTEM
                ================================= */}

                <p className="nav-label settings-label">
                    SYSTEM
                </p>

                <button
                    className={`nav-item ${
                        activePage === "settings"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("settings")
                    }
                >
                    <Settings size={19} />

                    <span>
                        Settings
                    </span>
                </button>

            </nav>

            {/* ================================
                FOOTER
            ================================= */}

            <div className="sidebar-footer">

                <div className="security-status">

                    <span className="status-dot"></span>

                    <div>
                        <strong>
                            System Secure
                        </strong>

                        <small>
                            All services operational
                        </small>
                    </div>

                </div>

            </div>

        </aside>
    );
};

export default Sidebar;