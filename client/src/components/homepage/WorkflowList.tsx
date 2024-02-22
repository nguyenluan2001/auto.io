import { Grid } from '@mui/material';
import React from 'react';
import WorkflowItem from './WorkflowItem';

type Props = {
  workflows: any;
  refetch: () => void;
};
export function WorkflowList({ workflows, refetch }: Props) {
  return (
    <Grid container spacing={2} sx={{ width: '100%', gridAutoRows: '1fr' }}>
      {workflows?.map((workflow: any) => (
        <WorkflowItem
          key={workflow?.id}
          refetch={refetch}
          workflow={workflow}
        />
      ))}
    </Grid>
  );
}
