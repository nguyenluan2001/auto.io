import { Icon } from '@iconify/react';
import { Box, Grid, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import { NodeTypes } from 'reactflow';
import { ITheme } from '@/theme/Theme';

type Props = {
  widget: any;
};

const StyledWidget = styled(Stack)(({ theme }: { theme?: ITheme }) => ({
  background: theme?.palette.background.main,
  border: `1px solid ${theme?.palette.border.secondary}`,
  padding: '8px 4px',
  borderRadius: '4px',
  cursor: 'move',
  '& .MuiTypography-root': {
    fontSize: '13px',
  },
}));

function Widget({ widget }: Props) {
  const onDragStart = (event: any, nodeType: NodeTypes) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <Grid item sm={6} md={6}>
      <StyledWidget
        direction="column"
        alignItems="center"
        onDragStart={(event) => onDragStart(event, widget?.key)}
        draggable
      >
        <Box>
          <Icon icon={widget?.icon} />
        </Box>
        <Typography>{widget?.title}</Typography>
      </StyledWidget>
    </Grid>
  );
}

export default Widget;
