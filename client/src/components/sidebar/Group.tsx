import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import { Icon } from '@iconify/react';
import Widget from './Widget';

function Group({ label, widgets }) {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<Icon icon={chevronDown} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontWeight: '900' }}>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container rowSpacing={2} columnSpacing={{ sm: 2, md: 2 }}>
          {widgets?.map((widget) => <Widget widget={widget} />)}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
export default Group;
