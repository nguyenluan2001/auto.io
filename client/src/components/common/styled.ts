import styled from '@emotion/styled';
import { TableCell, TextareaAutosize, tableCellClasses } from '@mui/material';
import { ITheme } from '@/theme/Theme';

const CustomTextArea = styled(TextareaAutosize)(
  ({ theme }: { theme?: ITheme }) => ({
    borderRadius: 'unset',
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    resize: 'vertical',
    background: theme?.palette.form.fieldBackgroundColor,
    border: `2px solid ${theme?.palette.border.inverted}`,
    color: 'white',
    '&:focus': {
      outline: `unset`,
    },
  })
);
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
