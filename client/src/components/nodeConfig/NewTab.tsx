import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';

type Props = {
  url: string;
  setValues: (params: FieldValues) => void;
};

function NewTab({ url, setValues }: Props) {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      url: '',
    },
  });
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch('url')]);
  useEffect(() => {
    setValue('url', url);
  }, [url, setValue]);
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2">URL</Typography>
      <Controller
        control={control}
        name="url"
        render={({ field }) => (
          <CustomTextArea
            minRows={5}
            {...field}
            placeholder="https://example.com"
          />
        )}
      />
    </Box>
  );
}

export default NewTab;
