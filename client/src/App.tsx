import { RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';
import Homepage from './pages/Homepage';
import WorkflowEdit from './components/WorkflowEdit';
import EditPage from './pages/EditPage';
import Storage from './pages/Storage';
import Layout from './components/Layout';
import CreatePage from './pages/CreatePage';
import TableDetail from './pages/TableDetail';
import AuthLayout from './components/AuthLayout';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

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
          path: 'workflows',
          element: <Homepage />,
        },
        {
          path: 'storage',
          element: <Storage />,
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
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          {/* <Layout> */}
          <RouterProvider router={router} />
          {/* </Layout> */}
        </SnackbarProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
