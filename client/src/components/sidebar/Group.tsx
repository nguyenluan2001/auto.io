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

type Props = {
  label: string;
  widgets: any;
};

function Group({ label, widgets }: Props) {
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
          {widgets?.map((widget: any) => (
            <Widget key={widget?.uid} widget={widget} />
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
export default Group;
