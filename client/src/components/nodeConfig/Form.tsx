import { EventHandler } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFlow } from '@/store/flow';

function Form() {
  const updateNodeInformation = useFlow((state) => state.updateNodeInformation);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selector: '',
      value: '',
    },
  });
  const onSubmit = (values) => {
    updateNodeInformation(values);
  };
  return (
    <div>
      <p>CSS Selector</p>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => <input {...field} placeholder="Selector" />}
      />
      <p>Value</p>
      <Controller
        control={control}
        name="value"
        render={({ field }) => <input {...field} placeholder="Value" />}
      />

      <button onClick={handleSubmit(onSubmit)}>Update</button>
    </div>
  );
}

export default Form;
