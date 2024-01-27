import { EventHandler, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import CodeEditor from '../common/CodeEditor';

type Props = {
  loopID: string;
  setValues: (values: FieldValues) => void;
};
type FieldValues = {
  loopID: string;
};

function BreakLoop({ loopID, setValues }: Props) {
  const { control, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      loopID: '',
    },
  });

  useEffect(() => {
    setValue('loopID', loopID);
  }, [loopID, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  return (
    <div>
      <p>CSS Selector</p>
      <Controller
        control={control}
        name="loopID"
        render={({ field }) => (
          <TextField fullWidth {...field} placeholder="Loop ID" />
        )}
      />
    </div>
  );
}

export default BreakLoop;
