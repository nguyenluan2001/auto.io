import { EventHandler, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';

type Props = {
  selector: string;
  setValues: (values: FieldValues) => void;
};

function GetText({ selector, setValues }: Props) {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      selector: '',
    },
  });
  useEffect(() => {
    setValue('selector', selector);
  }, [selector, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  return (
    <div>
      <p>CSS Selector</p>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => (
          <CustomTextArea minRows={5} {...field} placeholder="CSS Selector" />
        )}
      />
    </div>
  );
}

export default GetText;
