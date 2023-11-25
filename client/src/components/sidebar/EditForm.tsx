import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { FieldValues } from 'react-hook-form';
import { useFlow } from '@/store/flow';
import { config } from '@/utils/nodeConfig';
import { CustomTextArea } from '../common/styled';

export function EditForm() {
  const selectedNode = useFlow((state: any) => state.selectedNode);
  const updateNodeInformation = useFlow(
    (state: any) => state.updateNodeInformation
  );
  const [values, setValues] = useState(null);
  const [description, setDescription] = useState<string>('');
  useEffect(() => {
    setDescription(selectedNode?.data?.description);
  }, [selectedNode?.id, setDescription]);
  const handleChangeDescription = (e: React.EventHandler) => {
    const { value } = e.target;
    setDescription(value);
  };
  const handleUpdateNode = () => {
    updateNodeInformation({
      ...(values || {}),
      description,
    });
  };
  return (
    <Stack direction="column" spacing={2}>
      {selectedNode?.id}
      <Box>
        <Typography variant="body2">Description</Typography>
        <CustomTextArea
          minRows={5}
          // value={selectedNode?.data?.description}
          value={description}
          onChange={handleChangeDescription}
        />
      </Box>
      {React.createElement(
        config?.[selectedNode?.data?.key] as FunctionComponent,
        {
          ...selectedNode?.data,
          setValues,
        }
      )}
      <Button variant="contained" onClick={handleUpdateNode}>
        Update
      </Button>
    </Stack>
  );
}
