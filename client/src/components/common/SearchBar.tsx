import React from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Icon } from '@iconify/react';
import { debounce } from 'lodash';
import { InputEvent } from 'models/Event';
import CustomTextField from './CustomTextField';

type Props = {
  setKeywords: (value: string) => void;
  keywords: string;
};
function SearchBar({ setKeywords, keywords }: Props) {
  const onChange = (e: InputEvent) => {
    const { value } = e.target as any;
    setKeywords(value);
    console.log(value);
  };
  return (
    <CustomTextField
      sx={{
        '& input': {
          padding: '8px',
        },
        width: '20rem',
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon icon="material-symbols:search" />
          </InputAdornment>
        ),
      }}
      placeholder="Search..."
      onChange={debounce(onChange, 1000)}
      // value={keywords}
    />
  );
}

export default SearchBar;
