import { Icon } from '@iconify/react';
import earthIcon from '@iconify/icons-mdi/earth';
import playIcon from '@iconify/icons-mdi/play';
import dotsHorizontal from '@iconify/icons-mdi/dots-horizontal';
import pencilOutline from '@iconify/icons-mdi/pencil-outline';
import checkboxMultipleBlankOutline from '@iconify/icons-mdi/checkbox-multiple-blank-outline';
import trayArrowDown from '@iconify/icons-mdi/tray-arrow-down';
import deleteOutline from '@iconify/icons-mdi/delete-outline';

import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

function WorkflowItem({ workflow }) {
  return (
    <Grid item md={3} sx={{ minHeight: '100px' }}>
      <Box
        sx={{
          width: '100%',
          border: '1px solid black',
          p: 1,
          boxSizing: 'border-box',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Icon icon={earthIcon} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton>
              <Icon icon={playIcon} />
            </IconButton>
            <MoreMenu />
          </Stack>
        </Stack>
        <Typography variant="h5">{workflow?.name}</Typography>
        <Typography variant="body1">{workflow?.description}</Typography>
      </Box>
    </Grid>
  );
}
function MoreMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon icon={dotsHorizontal} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <ListItemIcon>
            <Icon icon={pencilOutline} />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon={checkboxMultipleBlankOutline} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon={trayArrowDown} />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon={deleteOutline} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default WorkflowItem;
