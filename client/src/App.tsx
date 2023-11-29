import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Homepage from './components/Homepage';
import WorkflowEdit from './components/WorkflowEdit';
import EditPage from './components/EditPage';

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Homepage />,
    },
    {
      path: '/create',
      element: <WorkflowEdit />,
    },
    {
      path: '/workflow/:uuid',
      element: <EditPage />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
