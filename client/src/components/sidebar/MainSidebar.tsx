import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import sitemapOutline from '@iconify/icons-mdi/sitemap-outline';
import databaseIcon from '@iconify/icons-mdi/database';
import { Icon, IconifyIcon } from '@iconify/react';

function CustomIcon({ icon }: { icon: IconifyIcon }) {
  return <Icon style={{ fontSize: '24px' }} icon={icon} />;
}
const sidebarConfig = [
  {
    id: 1,
    title: 'Workflows',
    icon: <CustomIcon icon={sitemapOutline} />,
    url: '/workflows',
  },
  {
    id: 2,
    title: 'Storage',
    icon: <CustomIcon icon={databaseIcon} />,
    url: '/storage',
  },
];

function NavItem({ label, icon, url, isSelected }: NavItemProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(url);
  };
  return (
    <ListItemButton
      sx={{ flexDirection: 'column', p: 0.5 }}
      selected={isSelected}
      onClick={onClick}
    >
      <ListItemIcon sx={{ width: 'fit-content', minWidth: 0 }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
function MainSidebar() {
  const location = useLocation();

  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{ p: 1, borderRight: '1px solid black', width: '100px' }}
    >
      {/* <Typography variant="h5" sx={{ mb: 5 }}>
        AutoFlow
      </Typography> */}
      <img src="/public/autoflow.png" alt="auto-flow" />
      <List component="nav" aria-label="main mailbox folders">
        {sidebarConfig?.map((tab) => (
          <NavItem
            key={tab?.id}
            label={tab?.title}
            icon={tab?.icon}
            url={tab?.url}
            isSelected={location?.pathname.startsWith(tab?.url)}
          />
        ))}
      </List>
    </Stack>
  );
}
type NavItemProps = {
  label: string;
  icon: any;
  url: string;
  isSelected: boolean;
};

export default MainSidebar;
