import {
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { Icon } from '@iconify/react';
import ProcessLogTable from '@/components/log/ProcessLogTable';
import Theme from '@/theme/Theme';
import SearchBar from '@/components/common/SearchBar';
import LoadingIcon from '@/components/common/LoadingIcon';
import { axiosInstance } from '@/utils/axios';

function ConnectionPage() {
  return (
    <Theme>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Connection
        </Typography>
        <ConnectionTable />
      </Container>
    </Theme>
  );
}
function ConnectionTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Connection</TableCell>
          <TableCell>Access</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableBodyDecision
        // isLoading={isLoading || isFetching}
        // processes={processes}
        // refetch={refetch}
        />
      </TableBody>
    </Table>
  );
}
function TableBodyDecision({
  processes,
  isLoading,
  refetch,
}: {
  // processes: Process[];
  isLoading: boolean;
  refetch: () => void;
}) {
  const handleConnect = () => {
    axiosInstance
      .get('/api/connections/google-drive/connect')
      .then((response) => {
        window.location.replace(response?.data?.url);
      });
  };
  if (isLoading) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={6}>
          <LoadingIcon />
        </TableCell>
      </TableRow>
    );
  }
  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon icon="logos:google-drive" style={{ fontSize: '32px' }} />
          <Stack>
            <Typography>Google drive</Typography>
            <Typography>registor.fake@gmail.com</Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>See, edit, create, and delete</TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleConnect}>
            Connect
          </Button>
          <Button variant="contained" color="error">
            Disconnect
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default ConnectionPage;
