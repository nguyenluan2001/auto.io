import { styled, TextField } from '@mui/material';

// const StyledTextField = styled(TextField)(({ theme }) => {});

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
