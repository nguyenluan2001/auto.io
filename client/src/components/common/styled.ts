import styled from '@emotion/styled';
import { TextareaAutosize } from '@mui/material';

const CustomTextArea = styled(TextareaAutosize)(() => ({
  borderRadius: '8px',
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
}));
export { CustomTextArea };
