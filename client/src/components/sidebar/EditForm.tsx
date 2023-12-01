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
import { getConnectedEdges, getIncomers, getOutgoers } from 'reactflow';
import { useFlow } from '@/store/flow';
import { config } from '@/utils/nodeConfig';
import { CustomTextArea } from '../common/styled';

export function EditForm() {
  const selectedNode = useFlow((state: any) => state.selectedNode);
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const edges = useFlow((state: any) => state.edges);
  const nodes = useFlow((state: any) => state.nodes);
  const updateNodeInformation = useFlow(
    (state: any) => state.updateNodeInformation
  );
  const setEdges = useFlow((state: any) => state.setEdges);
  const deleteNode = useFlow((state: any) => state.deleteNode);
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
  const handleDeleteNode = () => {
    const newEdges = [selectedNode].reduce((acc, node) => {
      const incomers = getIncomers(node, nodes, edges);
      const outgoers = getOutgoers(node, nodes, edges);
      const connectedEdges = getConnectedEdges([node], edges);

      const remainingEdges = acc.filter(
        (edge) => !connectedEdges.includes(edge)
      );

      const createdEdges = incomers.flatMap(({ id: source }) =>
        outgoers.map(({ id: target }) => ({
          id: `${source}->${target}`,
          source,
          target,
          type: 'smoothstep',
        }))
      );

      return [...remainingEdges, ...createdEdges];
    }, edges);
    setEdges(newEdges);
    setSelectedNode(null);
    deleteNode(selectedNode?.id);
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
      <Stack direction="row" spacing={2}>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          color="error"
          onClick={handleDeleteNode}
        >
          Delete
        </Button>
        <Button sx={{ flex: 1 }} variant="contained" onClick={handleUpdateNode}>
          Update
        </Button>
      </Stack>
    </Stack>
  );
}
