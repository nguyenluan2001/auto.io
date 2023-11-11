import { EventHandler } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFlow } from '@/store/flow';

function NewTab() {
  const updateNodeInformation = useFlow((state) => state.updateNodeInformation);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      url: '',
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
        name="url"
        render={({ field }) => (
          <input {...field} placeholder="https://example.com" />
        )}
      />

      <button onClick={handleSubmit(onSubmit)}>Update</button>
    </div>
  );
}

export default NewTab;
