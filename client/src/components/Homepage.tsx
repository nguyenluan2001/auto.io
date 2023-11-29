import React from 'react';
import { Container, Stack } from '@mui/material';
import { useWorkflows } from '@/hooks/useWorkflows';
import { WorkflowList } from './homepage/WorkflowList';

function Homepage() {
  const { data, isLoading } = useWorkflows();
  console.log('🚀 ===== Homepage ===== data:', data);
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <Container maxWidth="xl" sx={{ p: 1 }}>
      <Stack>
        <WorkflowList workflows={data} />
      </Stack>
    </Container>
  );
}

export default Homepage;
