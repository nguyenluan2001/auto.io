import { EventHandler } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFlow } from '@/store/flow';

function EventClick() {
  const updateNodeInformation = useFlow((state) => state.updateNodeInformation);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selector: '',
    },
  });
  const onSubmit = (values) => {
    updateNodeInformation(values);
  };
  return (
    <div>
      <p>URL</p>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => <input {...field} placeholder="CSS Selector" />}
      />

      <button onClick={handleSubmit(onSubmit)}>Update</button>
    </div>
  );
}

export default EventClick;
