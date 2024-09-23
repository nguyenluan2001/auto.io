import plusIcon from '@iconify/icons-mdi/plus';
import { Icon } from '@iconify/react';
import { Button, ButtonGroup as MuiButtonGroup, styled } from '@mui/material';
import { ITheme } from '@/theme/Theme';

type Props = {
  title: string;
  onClickCreate: () => void;
  onClickDropdown: (e: any) => void;
};

function ButtonGroup({ onClickCreate, onClickDropdown, title }: Props) {
  return (
    <StyledButtonGroup>
      <Button onClick={onClickCreate} variant="contained">
        {title}
      </Button>
      <Button variant="contained" onClick={onClickDropdown}>
        <Icon icon="mdi:chevron-down" />
      </Button>
    </StyledButtonGroup>
  );
}

const StyledButtonGroup = styled(MuiButtonGroup)(
  ({ theme }: { theme?: ITheme }) => ({
    borderRadius: '6px',
    [`& .MuiButton-root`]: {
      background: theme?.palette.anchor.main,
      color: 'white',
      fontSize: '0.87rem',
      lineHeight: '1.25rem',
      fontWeight: 700,
      textTransform: 'none',
    },
  })
);

export default ButtonGroup;
