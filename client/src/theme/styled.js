import { styled } from '@mui/material';

interface ITheme  {
    background: {
        dark: string;
    }
}

export const customStyled = (component, callback) => {
  let styledFn;
  if (typeof component === 'string') {
    styledFn = styled`${component}`;
  } else {
    styledFn = styled(component);
  }
  return styledFn(({ theme }) => callback(theme));
};
