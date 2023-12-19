import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';

type Props = {
  repeat_from: string;
  repeat_times: number;
  setValues: (params: FieldValues) => void;
};

function Repeat({ repeat_from, repeat_times, setValues }: Props) {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      repeat_from: '',
      repeat_times: 0,
    },
  });
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  useEffect(() => {
    setValue('repeat_from', repeat_from);
    setValue('repeat_times', repeat_times);
  }, [repeat_from, repeat_times, setValue]);
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="column" spacing={2}>
        <Box>
          <Typography variant="body2">Repeat from</Typography>
          <Controller
            control={control}
            name="repeat_from"
            render={({ field }) => (
              <TextField fullWidth {...field} placeholder="Block ID" />
            )}
          />
        </Box>
        <Box>
          <Typography variant="body2">Repeat times</Typography>
          <Controller
            control={control}
            name="repeat_times"
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                type="number"
                placeholder="Repeat times"
              />
            )}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default Repeat;
