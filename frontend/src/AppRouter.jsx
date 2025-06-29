
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FAQ from './pages/FAQPage';
import MaintenancePage from './pages/MaintenancePage';
import ExploreKBPage from './pages/ExploreKBPage';
import AgentPage from './pages/AgentPage';

function AppRouter() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<LandingPage />} />
                    <Route exact path="/faq" element={<FAQ />} />
                    <Route exact path="/chat_agent" element={ <AgentPage />} />
                    <Route exact path="/explore_kb" element={<ExploreKBPage />} />
                </Routes>
            </Router>
        </div>
    )
}

export default AppRouter