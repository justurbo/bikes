import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { LayoutWrapper } from 'components';
import { LoginPage, RegisterPage } from 'features/auth/AuthPage';
import AvailableBikesPage from 'features/bikes/AvailableBikesPage';
import BikeHistoryPage from 'features/bikes/BikeHistoryPage';
import ManageBikesPage from 'features/bikes/ManageBikesPage';
import MyReservationsPage from 'features/bikes/MyReservationsPage';
import UserHistoryPage from 'features/users/UserHistoryPage';
import UsersPage from 'features/users/UsersPage';
import useAuth, { AuthProvider } from 'providers/AuthProvider';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// https://github.com/tannerlinsley/react-query/issues/3476
declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const queryClient = new QueryClient();

const ProtectedApp = () => {
  const auth = useAuth();

  return (
    <Routes>
      {!auth.user ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LayoutWrapper />} />
          <Route path="/available-bikes" element={<AvailableBikesPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/manage-users" element={<UsersPage />} />
          <Route path="/manage-users/:id" element={<UserHistoryPage />} />
          <Route path="/manage-bikes" element={<ManageBikesPage />} />
          <Route path="/manage-bikes/:id" element={<BikeHistoryPage />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <ModalsProvider>
          <AuthProvider>
            <ProtectedApp />
          </AuthProvider>
        </ModalsProvider>
      </NotificationsProvider>
    </QueryClientProvider>
  );
}

export default App;
