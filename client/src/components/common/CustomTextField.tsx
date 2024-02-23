import { TextField } from '@mui/material';

function CustomTextField(props: any) {
  return (
    <TextField
      {...props}
      sx={{ background: 'white', ...props?.sx }}
      fullWidth
    />
  );
}
export default CustomTextField;
