import { EventHandler } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { useFlow } from '@/store/flow';

function EventClick() {
  const updateNodeInformation = useFlow(
    (state: any) => state.updateNodeInformation
  );
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selector: '',
    },
  });
  const onSubmit = (values: FieldValues) => {
    updateNodeInformation(values);
  };
  return (
    <div>
      <p>URL</p>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => (
          <TextField {...field} placeholder="https://example.com" />
        )}
      />

      <Button onClick={handleSubmit(onSubmit)}>Update</Button>
    </div>
  );
}

export default EventClick;
