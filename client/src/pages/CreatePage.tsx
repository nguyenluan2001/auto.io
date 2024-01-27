import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkflowEdit from '../components/WorkflowEdit';
import { useWorkflowByUUID } from '@/hooks/useWorkflowByUUID';
import { useFlow } from '@/store/flow';
import LoadingScreen from '../components/common/LoadingScreen';

type Params = Record<string, string | undefined>;
function CreatePage() {
  const reset = useFlow((state: any) => state.reset);
  useEffect(() => {
    console.log('reset');
    reset();
  }, []);
  return <WorkflowEdit refetch={() => {}} />;
}

export default CreatePage;
