import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '../lib/auth-context';
import { ThemeProvider } from '../lib/theme-context';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import RegisterExercise from './components/RegisterExercise';
import Progress from './components/Progress';
import HealthRecord from './components/HealthRecord';
import AI from './components/AI';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import CreateProfile from './components/CreateProfile';
import NotificationsPermission from './components/NotificationsPermission';
import Profile from './components/Profile';
import History from './components/History';
import Achievements from './components/Achievements';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseDetail from './components/ExerciseDetail';
import ExerciseTimer from './components/ExerciseTimer';
import Celebration from './components/Celebration';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <Splash />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/create-profile"
        element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications-permission"
        element={
          <ProtectedRoute>
            <NotificationsPermission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <RegisterExercise />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExerciseLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id"
        element={
          <ProtectedRoute>
            <ExerciseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id/timer"
        element={
          <ProtectedRoute>
            <ExerciseTimer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/celebrate"
        element={
          <ProtectedRoute>
            <Celebration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <HealthRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="h-[100dvh] w-full bg-app-bg relative overflow-hidden">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
