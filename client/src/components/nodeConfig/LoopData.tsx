import { EventHandler, useEffect } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import CodeEditor from '../common/CodeEditor';
import CustomTextField from '../common/CustomTextField';

type Props = {
  loop_through: string;
  data: string;
  setValues: (values: FieldValues) => void;
  numbers: {
    from: number;
    to: number;
  };
};
type FieldValues = {
  loop_through: string;
  data: string;
  numbers: {
    from: number;
    to: number;
  };
};
const LOOP_THROUGH = [
  {
    label: 'Numbers',
    value: 'NUMBERS',
  },
  {
    label: 'Custom data',
    value: 'CUSTOM_DATA',
  },
];

function LoopData({ loop_through, data, numbers, setValues }: Props) {
  const { control, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      loop_through: '',
      data: '',
      numbers: {
        from: 0,
        to: 0,
      },
    },
  });

  useEffect(() => {
    setValue('data', data);
    setValue('loop_through', loop_through);
    setValue('numbers', numbers);
  }, [loop_through, data, numbers, setValue]);
  useEffect(() => {
    setValues(watch());
    console.log(watch());
  }, [setValues, watch()]);
  return (
    <Stack direction="column" spacing={2}>
      <Controller
        control={control}
        name="loop_through"
        render={({ field: { value, onChange } }) => (
          <Autocomplete
            options={LOOP_THROUGH}
            getOptionLabel={(option) => option?.label}
            renderInput={(params) => (
              <CustomTextField label="Loop through" {...params} />
            )}
            onChange={(e, _value) => onChange(_value?.value)}
            value={LOOP_THROUGH.find((o) => o.value === loop_through)}
          />
        )}
      />
      {watch('loop_through') === 'NUMBERS' && (
        <NumberSection control={control} />
      )}
      {watch('loop_through') === 'CUSTOM_DATA' && (
        <CustomDataSection control={control} />
      )}
    </Stack>
  );
}
function NumberSection({ control }: { control: Control<FieldValues> }) {
  return (
    <Stack direction="row" spacing={2}>
      <Controller
        control={control}
        name="numbers.from"
        render={({ field }) => (
          <CustomTextField
            fullWidth
            {...field}
            type="number"
            label="From number"
          />
        )}
      />
      <Controller
        control={control}
        name="numbers.to"
        render={({ field }) => (
          <CustomTextField
            label="To number"
            fullWidth
            {...field}
            type="number"
          />
        )}
      />
    </Stack>
  );
}
function CustomDataSection({ control }: { control: Control<FieldValues> }) {
  return (
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
  );
}

export default LoopData;
