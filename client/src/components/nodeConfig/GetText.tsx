import { EventHandler, SyntheticEvent, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { set } from 'lodash';
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
  setValues: (values: FieldValues) => void;
};

function GetText({ selector, destination, setValues }: Props) {
  const { control, setValue, watch } = useForm({
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
    },
  });
  useEffect(() => {
    setValue('selector', selector);
    setValue('destination', destination);
  }, [selector, setValue]);
  useEffect(() => {
    setValues(watch());
  }, [setValues, watch()]);
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
                  options={['title', 'sub_title']}
                  renderInput={(params) => (
                    <TextField {...params} label="Column" />
                  )}
                  onChange={(
                    event: SyntheticEvent<Element, Event>,
                    value: string | null
                  ) => handleChangeTableColumn(value, onChange, destinationVal)}
                  value={destinationVal.TABLE.column}
                />
              )}
            </RadioGroup>
          </FormControl>
        )}
      />
    </div>
  );
}

export default GetText;
