
import './App.css';
import DashboardView from "./components/DashboardView";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MCPFrontend from './components/MCPFrontend';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/" element={<MCPFrontend />} />
      </Routes>
    </Router>
    </>
  );
}
export default App;
