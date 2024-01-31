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
  Card,
  CardContent,
  CardHeader,
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
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Workflow } from 'models/Workflow';

type Props = {
  workflow: Workflow;
};
function WorkflowItem({ workflow }: Props) {
  return (
    <Grid
      item
      lg={3}
      md={4}
      sm={6}
      xs={12}
      sx={{ height: 'auto', '& a': { textDecoration: 'none' } }}
    >
      <Link to={`/workflow/${workflow?.uuid}`}>
        <Card sx={{ height: '100%', cursor: 'pointer' }}>
          <CardHeader
            title={
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon icon={earthIcon} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  {workflow?.name}
                </Typography>
              </Stack>
            }
            action={<MoreMenu />}
          />
          <CardContent>
            <Box
              sx={{
                width: '100%',
                p: 1,
              }}
            >
              <Typography variant="body1">{workflow?.description}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
function MoreMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box onClick={(e) => e.preventDefault()}>
      <IconButton onClick={handleClick}>
        <Icon icon={dotsHorizontal} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <ListItemIcon>
            <Icon icon={playIcon} />
          </ListItemIcon>
          <ListItemText>Run</ListItemText>
        </MenuItem>
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
    </Box>
  );
}

export default WorkflowItem;
