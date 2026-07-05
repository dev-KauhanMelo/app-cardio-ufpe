import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-app-bg">
        <p className="text-[15px] text-muted-ink">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
