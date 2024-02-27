import plusIcon from '@iconify/icons-mdi/plus';
import { Icon } from '@iconify/react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { ClickEvent } from 'models/Event';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Schedule } from 'models/Schedule';
import { Trigger } from 'models/Trigger';
import { Workflow } from 'models/Workflow';
import EditScheduleForm from '@/components/schedule/EditScheduleForm';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import { useSchedules } from '@/hooks/useSchedules';
import { useWorkflows } from '@/hooks/useWorkflows';
import Theme from '@/theme/Theme';
import { axiosInstance } from '@/utils/axios';
import { TRIGGER_CONFIG } from '@/utils/triggerConfig';

function SchedulePage() {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const {
    data: { schedules },
    isLoading,
    isFetching,
    refetch,
  } = useSchedules();
  useEffect(() => {
    if (selectedSchedule?.id) {
      setIsOpenDialog(true);
    }
  }, [selectedSchedule]);
  const toggleDialog = (e: ClickEvent) => {
    e?.stopPropagation();
    setIsOpenDialog((pre) => !pre);
    setSelectedSchedule(null);
  };
  console.log('🚀 ===== SchedulePage ===== schedules:', schedules);
  return (
    <Theme>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Schedule
        </Typography>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            onClick={toggleDialog}
            variant="contained"
            startIcon={<Icon icon={plusIcon} />}
          >
            Create
          </Button>
        </Stack>
        <DialogCreateSchedule
          open={isOpenDialog}
          handleClose={toggleDialog}
          initialData={selectedSchedule}
          refetch={refetch}
        />
        <ScheduleTable
          isLoading={isLoading || isFetching}
          schedules={schedules}
          setSelectedSchedule={setSelectedSchedule}
          refetch={refetch}
        />
      </Container>
    </Theme>
  );
}

type DialogProps = {
  open: boolean;
  handleClose: (e: ClickEvent) => void;
  initialData: any;
  refetch: () => void;
};
type FieldValues = {
  workflow: Workflow | null;
  triggers: Trigger[];
};
function DialogCreateSchedule({
  open,
  handleClose,
  initialData,
  refetch,
}: DialogProps) {
  const { data: workflows } = useWorkflows();

  const { control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      workflow: null,
      triggers: [],
    },
  });
  useEffect(() => {
    if (initialData) {
      setValue('workflow', initialData?.workflow);
      const triggers: Trigger[] = initialData?.triggers?.map(
        (trigger: Trigger) => {
          return {
            ...trigger,
            ...(TRIGGER_CONFIG as any)?.[trigger?.type],
            database_id: trigger?.id,
          };
        }
      );
      setValue('triggers', triggers);
    }
  }, [initialData]);
  const onSubmit = async (values: FieldValues) => {
    if (initialData?.id) {
      const triggers = values?.triggers?.map((trigger: Trigger) => ({
        ...trigger,
        id: trigger?.database_id,
      }));
      const response = await axiosInstance.put(
        `/api/schedules/${initialData?.id}`,
        {
          ...values,
          triggers,
        }
      );
    } else {
      const response = await axiosInstance.post('/api/schedules', values);
    }
    refetch();
    handleClose(true as unknown as ClickEvent);
  };
  console.log('watch', watch());
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Create schedule</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <EditScheduleForm control={control} workflows={workflows} />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
export default SchedulePage;
