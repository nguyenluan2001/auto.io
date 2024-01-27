import React from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-mdi/plus';
import { useNavigate } from 'react-router-dom';
import { useWorkflows } from '@/hooks/useWorkflows';
import { WorkflowList } from '../components/homepage/WorkflowList';
import LoadingScreen from '@/components/common/LoadingScreen';

function Homepage() {
  const { data, isLoading } = useWorkflows();
  const navigate = useNavigate();
  const onClickCreate = () => {
    navigate('/create');
  };
  if (isLoading) return <LoadingScreen />;
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Workflows</Typography>
        <Button
          onClick={onClickCreate}
          startIcon={<Icon icon={plusIcon} />}
          variant="contained"
        >
          Create
        </Button>
      </Stack>
      <Stack>
        <WorkflowList workflows={data} />
      </Stack>
    </Container>
  );
}

export default Homepage;
