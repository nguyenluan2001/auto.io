import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import plusIcon from '@iconify/icons-mdi/plus';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import ProcessLogTable from '@/components/log/ProcessLogTable';
import Theme from '@/theme/Theme';
import SearchBar from '@/components/common/SearchBar';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import FieldTitle from '@/components/common/FieldTitle';
import { useWorkflows } from '@/hooks/useWorkflows';
import EditScheduleForm from '@/components/schedule/EditScheduleForm';

function SchedulePage() {
  return (
    <Theme>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Schedule
        </Typography>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button variant="contained" startIcon={<Icon icon={plusIcon} />}>
            Create
          </Button>
        </Stack>
        <DialogCreateSchedule open />
        <ScheduleTable />
      </Container>
    </Theme>
  );
}
function DialogCreateSchedule({ open }) {
  const { data: workflows } = useWorkflows();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      workflow: null,
      triggers: [],
    },
  });
  const onSubmit = (values) => {
    console.log('🚀 ===== onSubmit ===== values:', values);
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Create schedule</Typography>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <EditScheduleForm control={control} workflows={workflows} />
      </DialogContent>
    </Dialog>
  );
}
export default SchedulePage;
