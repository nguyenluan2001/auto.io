import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { ClickEvent } from 'models/Event';

type Props = {
  open: boolean;
  title: string;
  description: string;
  handleConfirm: (e: ClickEvent) => void;
  handleCancel: (e: ClickEvent) => void;
};
function CustomDialog({
  open,
  title,
  description,
  handleConfirm,
  handleCancel,
}: Props) {
  return (
    <Dialog
      onBackdropClick={(e) => e.stopPropagation()}
      open={open}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Stack
          sx={{ width: '100%' }}
          direction="row"
          justifyContent="flex-end"
          spacing={2}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
export default CustomDialog;
