import Editor from '@/components/editor';
import Sidebar from '@/components/sidebar';
import { useFlow } from '@/store/flow';

import { axiosInstance } from '@/utils/axios';

function App() {
  const flows = useFlow((state: any) => state.flows);
  const handleClick = async () => {
    const response = await axiosInstance.post('/test', flows);
    console.log('🚀 ===== handleClick ===== response:', response);
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
      }}
    >
      <Sidebar />
      <div style={{ flex: 1 }}>
        <button onClick={handleClick}>Click</button>
        <Editor />
      </div>
    </div>
  );
}

export default App;
