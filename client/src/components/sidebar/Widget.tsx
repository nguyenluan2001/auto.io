import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';

function Widget({ widget }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <Grid item sm={6} md={6}>
      <Stack
        sx={{ width: '100%', background: '#f5f5f5', borderRadius: 1, py: 1 }}
        direction="column"
        alignItems="center"
        onDragStart={(event) => onDragStart(event, widget?.key)}
        draggable
      >
        <Box>{widget?.icon}</Box>
        <Typography>{widget?.title}</Typography>
      </Stack>
    </Grid>
  );
}

export default Widget;
