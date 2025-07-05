
import './App.css';
import DashboardView from "./components/DashboardView";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MCPFrontend from './components/MCPFrontend';
import LoginPage from "./components/Login";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/mail" element={<MCPFrontend />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
    </>
  );
}
export default App;
