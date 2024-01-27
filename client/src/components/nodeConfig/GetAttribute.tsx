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
  selector_type: string;
  setValues: (values: FieldValues) => void;
  loop_through: string;
  select: string;
  attribute: string;
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
  selector_type: string;
  loop_through: string;
  select: string;
  attribute: string;
};

function GetAttribute({
  selector,
  destination,
  selector_type,
  loop_through,
  select,
  attribute,
  setValues,
}: Props) {
  const { control, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      selector: '',
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
      selector_type: 'SINGLE',
      loop_through: '',
      select: '',
      attribute: '',
    },
  });
  const columns = useFlow((state: any) => state?.table?.columns) as Column[];
  console.log('🚀 ===== columns:', columns);
  useEffect(() => {
    setValue('selector', selector);
    setValue('destination', destination);
    setValue('selector_type', selector_type || 'SINGLE');
    setValue('loop_through', loop_through);
    setValue('select', select);
    setValue('attribute', attribute);
  }, [selector, destination, selector_type, loop_through, select, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  console.log('watch', watch());
  const handleChangeDestination = (
    e: any,
    onChange: (value: any) => void,
    values: any
  ) => {
    const newValue = {
      ...values,
      [e.target.name]: {
        selected: e.target.checked,
      },
    };
    onChange(newValue);
  };
  const handleChangeVariableName = (
    e: any,
    onChange: (value: any) => void,
    values: any
  ) => {
    const { value } = e.target;
    const newValues = set({ ...values }, 'VARIABLE.variable_name', value);
    onChange(newValues);
  };
  const handleChangeTableColumn = (
    value: string | null,
    onChange: (value: any) => void,
    formValues: any
  ) => {
    const newValues = set({ ...formValues }, 'TABLE.column', value);
    onChange(newValues);
  };
  const SELECTOR_TYPE = [
    {
      label: 'Single',
      value: 'SINGLE',
    },
    {
      label: 'Looping',
      value: 'LOOPING',
    },
  ];
  return (
    <div>
      <Controller
        control={control}
        name="selector_type"
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            options={SELECTOR_TYPE}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField label="Selector type" {...params} />
            )}
            onChange={(e, _value) => onChange(_value?.value)}
            value={SELECTOR_TYPE.find((item) => item.value === value)}
          />
        )}
      />
      {watch('selector_type') === 'SINGLE' && (
        <SingleSelector control={control} />
      )}
      {watch('selector_type') === 'LOOPING' && (
        <LoopingSelector control={control} />
      )}
      <Box>
        <Typography>Attribute</Typography>
        <Controller
          control={control}
          name="attribute"
          render={({ field }) => (
            <TextField fullWidth {...field} placeholder="Attribute name" />
          )}
        />
      </Box>
      <Controller
        control={control}
        name="destination"
        render={({ field: { onChange, value: destinationVal } }) => (
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={destinationVal}
              onChange={onChange}
            >
              <FormControlLabel
                value="VARIABLE"
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleChangeDestination(e, onChange, destinationVal)
                    }
                    name="VARIABLE"
                    checked={destinationVal.VARIABLE.selected}
                  />
                }
                label="Assign to variable"
              />
              {destinationVal?.VARIABLE?.selected && (
                <TextField
                  placeholder="Variable name"
                  value={destinationVal.VARIABLE.variable_name}
                  onChange={(e) =>
                    handleChangeVariableName(e, onChange, destinationVal)
                  }
                />
              )}
              <FormControlLabel
                value="TABLE"
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleChangeDestination(e, onChange, destinationVal)
                    }
                    name="TABLE"
                    checked={destinationVal.TABLE.selected}
                  />
                }
                label="Insert to table"
              />
              {destinationVal?.TABLE?.selected && (
                <Autocomplete
                  getOptionLabel={(option) => option?.name}
                  options={columns || []}
                  renderInput={(params) => (
                    <TextField {...params} label="Column" />
                  )}
                  onChange={(
                    event: SyntheticEvent<Element, Event>,
                    value: Column | null
                  ) =>
                    handleChangeTableColumn(
                      value?.name as string,
                      onChange,
                      destinationVal
                    )
                  }
                  value={
                    columns?.find(
                      (column) => column?.name === destinationVal?.TABLE?.column
                    ) || null
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
        )}
      />
    </div>
  );
}
function SingleSelector({ control }: { control: Control<FieldValues> }) {
  return (
    <Box>
      <Typography>CSS Selector</Typography>
      <Controller
        control={control}
        name="selector"
        render={({ field }) => (
          <CustomTextArea minRows={5} {...field} placeholder="CSS Selector" />
        )}
      />
    </Box>
  );
}
function LoopingSelector({ control }: { control: Control<FieldValues> }) {
  return (
    <Stack>
      <Box>
        <Typography>Loop through</Typography>
        <Controller
          control={control}
          name="loop_through"
          render={({ field }) => (
            <CustomTextArea minRows={5} {...field} placeholder="CSS Selector" />
          )}
        />
      </Box>
      <Box>
        <Typography>Select</Typography>
        <Controller
          control={control}
          name="select"
          render={({ field }) => (
            <CustomTextArea minRows={5} {...field} placeholder="CSS Selector" />
          )}
        />
      </Box>
    </Stack>
  );
}

export default GetAttribute;
