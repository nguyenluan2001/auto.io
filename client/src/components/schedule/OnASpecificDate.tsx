import { Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type Props = {
  date: Date;
  handleUpdate: (value: any) => void;
};
function OnASpecificDate({ date, handleUpdate }: Props) {
  const handleChange = (value: any) => {
    handleUpdate({
      date: value,
    });
  };
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={2}>
      <DateTimePicker
        defaultValue={dayjs('2022-04-17T15:30') as unknown as Date}
        sx={{ width: '100%' }}
        onChange={handleChange}
      />
    </Stack>
  );
}

export default OnASpecificDate;
