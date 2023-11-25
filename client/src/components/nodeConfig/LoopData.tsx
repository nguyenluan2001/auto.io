import { EventHandler, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import CodeEditor from '../common/CodeEditor';

type Props = {
  selector: string;
  data: string;
  setValues: (values: FieldValues) => void;
};

function LoopData({ selector, data, setValues }: Props) {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      selector: '',
      data: '',
    },
  });

  useEffect(() => {
    setValue('selector', selector);
    setValue('data', data);
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
      <Controller
        control={control}
        name="data"
        render={({ field: { value, onChange } }) => (
          <CodeEditor
            value={value}
            handleChange={(_value: string) => {
              onChange(_value);
            }}
          />
        )}
      />
    </div>
  );
}

export default LoopData;
