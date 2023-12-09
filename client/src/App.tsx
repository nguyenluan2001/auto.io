import { RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import Homepage from './components/Homepage';
import WorkflowEdit from './components/WorkflowEdit';
import EditPage from './components/EditPage';
import Storage from './pages/Storage';
import Layout from './components/Layout';

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
          path: '',
          element: <Homepage />,
        },
        {
          path: 'storage',
          element: <Storage />,
        },
        {
          path: 'create',
          element: <WorkflowEdit />,
        },
        {
          path: 'workflow/:uuid',
          element: <EditPage />,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        {/* <Layout> */}
        <RouterProvider router={router} />
        {/* </Layout> */}
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
