import {
  Navigate,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';
import { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditPage from './pages/EditPage';
import Storage from './pages/Storage';
import Layout from './components/Layout';
import CreatePage from './pages/CreatePage';
import TableDetail from './pages/TableDetail';
import AuthLayout from './components/AuthLayout';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { VITE_APP_GOOGLE_CLIENT_ID } from './utils/constant';
import { socket } from './utils/socket';
import Workflow from './pages/Workflow';
import LogPage from './pages/LogPage';
import SchedulePage from './pages/SchedulePage';
import ConnectionPage from './pages/ConnectionPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Navigate to="/workflows" />,
        },
        {
          path: 'workflows',
          element: <Workflow />,
        },
        {
          path: 'storage',
          element: <Storage />,
        },
        {
          path: 'logs',
          element: <LogPage />,
        },
        {
          path: 'schedules',
          element: <SchedulePage />,
        },
        {
          path: 'connections',
          element: <ConnectionPage />,
        },
        {
          path: 'storage/tables/:id',
          element: <TableDetail />,
        },
        {
          path: 'create',
          element: <CreatePage />,
        },
        {
          path: 'workflows/:uuid',
          element: <EditPage />,
        },
      ],
    },
    {
      path: '/sign-up',
      element: <AuthLayout />,
      children: [
        {
          path: '',
          element: <SignUp />,
        },
      ],
    },
    {
      path: '/sign-in',
      element: <AuthLayout />,
      children: [
        {
          path: '',
          element: <SignIn />,
        },
      ],
    },
  ]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider autoHideDuration={2000}>
            <GoogleOAuthProvider clientId={VITE_APP_GOOGLE_CLIENT_ID}>
              <RouterProvider router={router} />
            </GoogleOAuthProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </CookiesProvider>
    </LocalizationProvider>
  );
}

export default App;
