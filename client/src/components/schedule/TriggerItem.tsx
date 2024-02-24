import styled from '@emotion/styled';
import { IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Icon } from '@iconify/react';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  marginTop: 0,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<Icon icon="mdi:chevron-down" />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function TriggerItem({ title, component, handleDelete, ...others }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded((pre) => !pre);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange('panel1')}
      disableGutters
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Stack
          sx={{ width: '100%' }}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography>{title}</Typography>
          <IconButton onClick={handleDelete}>
            <Icon icon="mdi:delete-outline" />
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {React.createElement(component, others)}
      </AccordionDetails>
    </Accordion>
  );
}

export default TriggerItem;
