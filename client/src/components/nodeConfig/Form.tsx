import { EventHandler, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';

type Props = {
  selector: string;
  value: string;
  setValues: (values: FieldValues) => void;
};

function Form({ selector, value, setValues }: Props) {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      selector: '',
      value: '',
    },
  });
  useEffect(() => {
    setValue('selector', selector);
    setValue('value', value);
  }, [selector, value, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  return (
    <Stack direction="column" spacing={2}>
      <Box>
        <Typography variant="body2">CSS Selector</Typography>
        <Controller
          control={control}
          name="selector"
          render={({ field }) => (
            <CustomTextArea
              minRows={5}
              {...field}
              placeholder="Input selector"
            />
          )}
        />
      </Box>
      <Box>
        <Typography variant="body2">Value</Typography>
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <CustomTextArea minRows={5} {...field} placeholder="Value" />
          )}
        />
      </Box>
    </Stack>
  );
}

export default Form;
