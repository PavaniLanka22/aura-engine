import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";

const App = () => {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "inventory":
                return <Inventory />;

            case "dashboard":
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <div className="main-area">

                <Topbar />

                <main className="page-content">
                    {renderPage()}
                </main>

            </div>

        </div>
    );
};

export default App;