import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/store/user';

function UserPopover() {
  const { setCurrentUser, currentUser } = useUser((state) => state);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    try {
      Cookies.remove('autoflow_token');
      navigate('/sign-in');
    } catch (error) {
      console.log('🚀 ===== handleSignOut ===== error:', error);
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <Avatar onClick={handleClick}>{currentUser?.email?.[0]}</Avatar>
      <Paper width={320}>
        <Menu
          dense
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            sx: {
              p: 2,
              '&.MuiPopover-paper': {
                left: 80,
              },
            },
          }}
          anchorPosition={{
            left: 800,
          }}
        >
          <Typography variant="body" sx={{ fontWeight: 600 }}>
            SIGNED IN AS
          </Typography>
          <Stack direction="row" spacing={2} sx={{ p: 1, py: 2 }}>
            <Avatar onClick={handleClick}>{currentUser?.email?.[0]}</Avatar>
            <Stack direction="column">
              <Typography sx={{ fontWeight: 600 }}>
                {currentUser?.username || 'User 1'}{' '}
              </Typography>
              <Typography>{currentUser?.email} </Typography>
            </Stack>
          </Stack>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Icon icon="mdi:settings-outline" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Icon icon="mdi:sign-out" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
}

export default UserPopover;
