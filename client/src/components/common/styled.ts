import styled from '@emotion/styled';
import { TableCell, TextareaAutosize, tableCellClasses } from '@mui/material';

const CustomTextArea = styled(TextareaAutosize)(() => ({
  borderRadius: '8px',
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  resize: 'vertical',
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'black',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export { CustomTextArea, StyledTableCell };
