import {
    Bell,
    Search
} from "lucide-react";

const Topbar = () => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="breadcrumb">
                    <span>Operations</span>
                    <span>/</span>
                    <strong>Command Center</strong>
                </div>
            </div>

            <div className="topbar-right">
                <button className="icon-button">
                    <Search size={19} />
                </button>

                <button className="icon-button notification-button">
                    <Bell size={19} />
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile">
                    <div className="avatar">
                        JH
                    </div>

                    <div className="user-details">
                        <strong>Jonathan Hayes</strong>
                        <span>VP of Operations</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;