import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Stack,
} from '@mui/material';
import { set } from 'lodash';
import { SyntheticEvent, useEffect } from 'react';
import { Control, Controller, UseFormProps, useForm } from 'react-hook-form';
import { InputEvent } from 'models/Event';
import { Column, Table } from 'models/Table';
import { useFlow } from '@/store/flow';
import CustomTextField from '../common/CustomTextField';
import FieldTitle from '../common/FieldTitle';
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
  type: string;
  file_name: string;
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
  type: string;
  file_name: string;
};

function SaveAsset({
  selector,
  destination,
  selector_type,
  loop_through,
  select,
  setValues,
  file_name,
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
      type: 'MEDIA_ELEMENT',
      loop_through: '',
      select: '',
      file_name: '',
    },
  });
  const columns = useFlow((state: any) => state?.table?.columns);
  useEffect(() => {
    setValue('selector', selector);
    setValue('destination', destination);
    setValue('selector_type', selector_type || 'SINGLE');
    setValue('loop_through', loop_through);
    setValue('select', select);
    setValue('file_name', file_name);
  }, [
    selector,
    destination,
    selector_type,
    loop_through,
    select,
    setValue,
    file_name,
  ]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
  const handleChangeDestination = (
    e: InputEvent,
    onChange: (value: any) => void,
    values: any
  ) => {
    const newValue = {
      ...values,
      [e.target.name]: {
        selected: (e.target as HTMLInputElement).checked,
      },
    };
    onChange(newValue);
  };
  const handleChangeVariableName = (
    e: InputEvent,
    onChange: (value: string) => void,
    values: any
  ) => {
    const { value } = e.target as HTMLInputElement;
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
  const TYPE = [
    {
      label: 'Media element(image, audio or video)',
      value: 'MEDIA_ELEMENT',
    },
    {
      label: 'URL',
      value: 'URL',
    },
  ];
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
    <Stack direction="column" spacing={2}>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <Box>
            <FieldTitle title="Type" />
            <Autocomplete
              options={TYPE}
              getOptionLabel={(option) => option?.label}
              renderInput={(params) => <CustomTextField {...params} />}
              onChange={(e, _value) => onChange(_value?.value)}
              value={TYPE.find((item) => item.value === value)}
            />
          </Box>
        )}
      />
      <Controller
        control={control}
        name="selector_type"
        render={({ field: { onChange, value } }) => (
          <Box>
            <FieldTitle title="Selector type" />
            <Autocomplete
              options={SELECTOR_TYPE}
              getOptionLabel={(option) => option?.label}
              renderInput={(params) => <CustomTextField {...params} />}
              onChange={(e, _value) => onChange(_value?.value)}
              value={SELECTOR_TYPE.find((item) => item.value === value)}
            />
          </Box>
        )}
      />
      {watch('selector_type') === 'SINGLE' && (
        <SingleSelector control={control} />
      )}
      {watch('selector_type') === 'LOOPING' && (
        <LoopingSelector control={control} />
      )}
      <Controller
        control={control}
        name="file_name"
        render={({ field }) => (
          <Box>
            <FieldTitle title="File name" />
            <CustomTextField {...field} placeholder="image.png" />
          </Box>
        )}
      />
      <Divider orientation="horizontal" />
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
                <CustomTextField
                  placeholder="Variable name"
                  value={destinationVal.VARIABLE.variable_name}
                  onChange={(e: InputEvent) =>
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
                    <CustomTextField {...params} label="Column" />
                  )}
                  onChange={(
                    event: SyntheticEvent<Element, Event>,
                    value: Table
                  ) =>
                    handleChangeTableColumn(
                      value?.name,
                      onChange,
                      destinationVal
                    )
                  }
                  value={
                    columns?.find(
                      (column: Column) =>
                        column?.name === destinationVal?.TABLE?.column
                    ) || null
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
        )}
      />
    </Stack>
  );
}
function SingleSelector({ control }: { control: Control<FieldValues> }) {
  return (
    <Controller
      control={control}
      name="selector"
      render={({ field }) => (
        <Box>
          <FieldTitle title="Element Selector" />
          <CustomTextArea minRows={5} {...field} />
        </Box>
      )}
    />
  );
}
function LoopingSelector({ control }: { control: Control<FieldValues> }) {
  return (
    <Stack>
      <Box>
        <FieldTitle title="Loop through" />
        <Controller
          control={control}
          name="loop_through"
          render={({ field }) => (
            <Box>
              <CustomTextArea minRows={5} {...field} />
            </Box>
          )}
        />
      </Box>
      <Box>
        <FieldTitle title="Select" />
        <Controller
          control={control}
          name="select"
          render={({ field }) => <CustomTextArea minRows={5} {...field} />}
        />
      </Box>
    </Stack>
  );
}

export default SaveAsset;
