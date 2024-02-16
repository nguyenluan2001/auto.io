import { EventHandler, useEffect, useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import CodeEditor from '../common/CodeEditor';
import CustomTextField from '../common/CustomTextField';
import FieldTitle from '../common/FieldTitle';

type Props = {
  loop_through: string;
  id: string;
  data: string;
  setValues: (values: FieldValues) => void;
  numbers: {
    from: number;
    to: number;
  };
};
type FieldValues = {
  loop_through: string;
  loop_id: string;
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

function LoopData({ id, loop_through, data, numbers, setValues }: Props) {
  console.log('🚀 ===== LoopData ===== id:', id);
  const { control, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      loop_through: '',
      loop_id: '',
      data: '',
      numbers: {
        from: 0,
        to: 0,
      },
    },
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    setValue('data', data);
    setValue('loop_through', loop_through);
    setValue('numbers', numbers);
    setValue('loop_id', id);
  }, [loop_through, data, numbers, setValue]);
  useEffect(() => {
    setValues(watch());
    console.log(watch());
  }, [setValues, watch()]);
  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <Stack direction="column" spacing={2}>
      <Box>
        <FieldTitle title="Loop ID" />
        <Controller
          control={control}
          name="loop_id"
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={!isCopied ? 'Copy' : 'Copied'}>
                      <IconButton onClick={() => handleCopyToClipboard(value)}>
                        <Icon icon="mdi:content-copy" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              value={value}
            />
          )}
        />
      </Box>
      <Box>
        <FieldTitle title="Loop through" />
        <Controller
          control={control}
          name="loop_through"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              options={LOOP_THROUGH}
              getOptionLabel={(option) => option?.label}
              renderInput={(params) => <CustomTextField {...params} />}
              onChange={(e, _value) => onChange(_value?.value)}
              value={LOOP_THROUGH.find((o) => o.value === loop_through)}
            />
          )}
        />
      </Box>
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
