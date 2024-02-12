import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import SimpleBar from 'simplebar-react';
import { Table } from 'models/Table';
import { InputEvent } from 'models/Event';
import { useTables } from '@/hooks/useTables';
import { useFlow } from '@/store/flow';
import { GROUPS } from '@/utils/groupConfig';
import { CustomTextArea } from '../common/styled';
import Group from './Group';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';
import 'simplebar-react/dist/simplebar.min.css';

function EditWorkflowForm() {
  // const setName = useFlow((state: any) => state.setName);
  // const setDescription = useFlow((state: any) => state.setDescription);
  const { data: tables, isLoading, refetch } = useTables({ options: {} });
  const { setName, setDescription, setConnectTable, name, description, table } =
    useFlow((state) => state) as {
      setName: (value: string) => void;
      setDescription: (value: string) => void;
      setConnectTable: (tableData: Table) => void;
      name: string;
      description: string;
      table: Table;
    };
  const handleChangeName = (e: InputEvent) => {
    const { value } = e.target as HTMLInputElement;
    setName(value);
  };
  const handleChangeDescription = (e: InputEvent) => {
    const { value } = e.target as HTMLInputElement;
    setDescription(value);
  };
  const handleChangeTable = (tableData: Table) => setConnectTable(tableData);
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ height: '100vh', boxSizing: 'border-box', pb: 2 }}
    >
      <Box>
        <FieldTitle title="Workflow name" />
        <CustomTextField fullWidth value={name} onChange={handleChangeName} />
      </Box>
      <Box>
        <FieldTitle title="Description" />
        <CustomTextArea
          minRows={5}
          value={description}
          onChange={handleChangeDescription}
        />
      </Box>
      <Box>
        <FieldTitle title="Connect table" />
        <Autocomplete
          options={tables || []}
          renderInput={(params) => <CustomTextField {...params} />}
          getOptionLabel={(option) => option?.name}
          onChange={(e, value) => handleChangeTable(value)}
          value={tables?.find((t: Table) => t.id === table?.id) || null}
          isOptionEqualToValue={(option, value) =>
            option?.id?.toString() === value?.id?.toString()
          }
        />
      </Box>
      <Box sx={{ flex: 0.95 }}>
        <SimpleBar
          style={
            {
              minHeight: 100,
              maxHeight: '90%',
              '& .simplebar-placeholder': {
                maxHeight: '500px',
              },
              // '& .simplebar-content': {
              //   maxHeight: '100%',
              //   // display: 'flex',
              //   // flexDirection: 'column',
              // },
            } as React.CSSProperties
          }
        >
          {GROUPS?.map((group, index) => (
            <Group key={index} title={group?.title} widgets={group?.widgets} />
          ))}
        </SimpleBar>
      </Box>
    </Stack>
  );
}

export default EditWorkflowForm;
