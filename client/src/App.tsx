import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Homepage from './components/Homepage';
import WorkflowEdit from './components/WorkflowEdit';

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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
