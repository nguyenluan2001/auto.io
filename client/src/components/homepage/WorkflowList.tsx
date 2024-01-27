import { Grid } from '@mui/material';
import React from 'react';
import WorkflowItem from './WorkflowItem';

type Props = {
  workflows: any;
};
export function WorkflowList({ workflows }: Props) {
  return (
    <Grid container spacing={2} sx={{ width: '100%', gridAutoRows: '1fr' }}>
      {workflows?.map((workflow: any) => <WorkflowItem workflow={workflow} />)}
    </Grid>
  );
}
