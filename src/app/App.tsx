import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './components/Dashboard';
import RegisterExercise from './components/RegisterExercise';
import Progress from './components/Progress';
import HealthRecord from './components/HealthRecord';
import AI from './components/AI';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="w-[390px] h-[844px] bg-[#F7F9FC] relative overflow-hidden shadow-2xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterExercise />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/health" element={<HealthRecord />} />
            <Route path="/ai" element={<AI />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
