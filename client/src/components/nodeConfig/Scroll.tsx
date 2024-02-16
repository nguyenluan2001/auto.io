import { EventHandler, SyntheticEvent, useEffect } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { set } from 'lodash';
import { Column } from 'models/Table';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

type Props = {
  selector: string;
  destination: {
    VARIABLE: {
      selected: boolean;
      variable_name: string;
    };
    TABLE: {
      selected: boolean;
      column: string;
    };
  };
  setValues: (values: FieldValues) => void;
  scroll_behavior: string;
  horizontal: number;
  vertical: number;
};
type FieldValues = {
  selector: string;
  destination: {
    VARIABLE: {
      selected: boolean;
      variable_name: string;
    };
    TABLE: {
      selected: boolean;
      column: string;
    };
  };
  scroll_behavior: string;
  horizontal: number;
  vertical: number;
};
const SCROLL_BEHAVIORS = [
  {
    id: 1,
    label: 'Scroll into view',
    value: 'SCROLL_INTO_VIEW',
  },
  {
    id: 2,
    label: 'Smooth scroll',
    value: 'SMOOTH_SCROLL',
  },
];

function Scroll({
  selector,
  setValues,
  scroll_behavior,
  horizontal,
  vertical,
}: Props) {
  const { control, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      selector: 'html',
      destination: {
        VARIABLE: {
          selected: false,
          variable_name: '',
        },
        TABLE: {
          selected: false,
          column: '',
        },
      },
      scroll_behavior: 'SMOOTH_SCROLL',
    },
  });
  useEffect(() => {
    setValue('selector', selector);
    setValue('scroll_behavior', scroll_behavior);
    setValue('horizontal', horizontal);
    setValue('vertical', vertical);
  }, [selector, scroll_behavior, horizontal, vertical, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  console.log('watch', watch());
  return (
    <Stack direction="column" spacing={2}>
      <Box>
        <FieldTitle title="CSS Selector" />
        <Controller
          control={control}
          name="selector"
          render={({ field }) => (
            <CustomTextArea minRows={5} {...field} placeholder="CSS Selector" />
          )}
        />
      </Box>
      <Box>
        <FieldTitle title="Scroll behavior" />
        <Controller
          control={control}
          name="scroll_behavior"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              options={SCROLL_BEHAVIORS}
              getOptionLabel={(option) => option?.label}
              renderInput={(params) => <CustomTextField {...params} />}
              onChange={(e, _value) => onChange(_value?.value)}
              value={SCROLL_BEHAVIORS.find((o) => o.value === scroll_behavior)}
            />
          )}
        />
      </Box>
      {/* <Stack direction="row" spacing={2}>
        <Box>
          <FieldTitle title="Scroll horizontal" />
          <Controller
            control={control}
            name="horizontal"
            render={({ field }) => (
              <CustomTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
                {...field}
              />
            )}
          />
        </Box>
        <Box>
          <FieldTitle title="Scroll vertical" />
          <Controller
            control={control}
            name="vertical"
            render={({ field }) => (
              <CustomTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
                {...field}
              />
            )}
          />
        </Box>
      </Stack> */}
    </Stack>
  );
}

export default Scroll;
