import { EventHandler, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, TextField, Typography } from '@mui/material';
import { useFlow } from '@/store/flow';

function Form() {
  const updateNodeInformation = useFlow(
    (state: any) => state.updateNodeInformation
  );
  const selectedNode = useFlow((state: any) => state.selectedNode);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      selector: '',
      value: '',
    },
  });
  useEffect(() => {
    if (selectedNode?.id) {
      setValue('selector', selectedNode?.selector);
      setValue('value', selectedNode?.value);
    }
  }, [selectedNode, setValue]);
  const onSubmit = (values: FieldValues) => {
    updateNodeInformation(values);
  };
  return (
    <div>
      <Typography variant="body1">CSS Selector</Typography>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => (
          <TextField {...field} placeholder="Input selector" />
        )}
      />
      <Typography variant="body1">Value</Typography>
      <Controller
        control={control}
        name="value"
        render={({ field }) => <TextField {...field} placeholder="Value" />}
      />
      <Button onClick={handleSubmit(onSubmit)}>Update</Button>
    </div>
  );
}

export default Form;
