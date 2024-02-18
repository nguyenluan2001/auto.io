import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

type Props = {
  open: boolean;
  title: string;
  description: string;
  handleConfirm: () => void;
  handleCancel: () => void;
};
function CustomDialog({
  open,
  title,
  description,
  handleConfirm,
  handleCancel,
}: Props) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
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
