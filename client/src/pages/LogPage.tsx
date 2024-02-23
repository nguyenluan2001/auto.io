import { Container, Typography } from '@mui/material';
import React from 'react';
import ProcessLogTable from '@/components/log/ProcessLogTable';
import Theme from '@/theme/Theme';
import SearchBar from '@/components/common/SearchBar';

function LogPage() {
  return (
    <Theme>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Logs
        </Typography>
        <ProcessLogTable />
      </Container>
    </Theme>
  );
}

export default LogPage;
