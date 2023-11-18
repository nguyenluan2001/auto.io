import { Box, Button } from '@mui/material';
import React from 'react';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';

function Toolbar() {
  const flows = useFlow((state: any) => state.flows);
  const handleClick = async () => {
    const response = await axiosInstance.post('/test', flows);
    console.log('🚀 ===== handleClick ===== response:', response);
  };
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
      }}
    >
      <Button onClick={handleClick} variant="contained">
        Run
      </Button>
    </Box>
  );
}

export default Toolbar;
