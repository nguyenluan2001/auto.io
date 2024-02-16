import { Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  required?: boolean;
};
function FieldTitle({ title, required = false }: Props) {
  return (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {required && <span style={{ color: 'red' }}>*</span>}
    </Stack>
  );
}
export default FieldTitle;
