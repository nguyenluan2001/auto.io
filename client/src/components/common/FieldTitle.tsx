import { Typography } from '@mui/material';

type Props = {
  title: string;
};
function FieldTitle({ title }: Props) {
  return (
    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
  );
}
export default FieldTitle;
