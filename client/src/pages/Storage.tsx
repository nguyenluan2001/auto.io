import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import { a11yProps } from '@/utils/mui';
import TabPanel from '@/components/common/TabPanel';
import TableList from '@/components/storage/TableList';

function Storage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Storage
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tables" {...a11yProps(0)} />
          <Tab label="Variables" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TableList />
      </TabPanel>
    </Container>
  );
}

export default Storage;
