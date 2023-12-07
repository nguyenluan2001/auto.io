import { Box, Stack, Tooltip } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import sitemapOutline from '@iconify/icons-mdi/sitemap-outline';
import databaseIcon from '@iconify/icons-mdi/database';
import { Icon, IconifyIcon } from '@iconify/react';

function NavItem({ label, icon, url }: NavItemProps) {
  return (
    <Tooltip title={label} placement="right">
      <Link to={url}>
        <Box>
          <Icon style={{ fontSize: '32px' }} icon={icon} />
        </Box>
      </Link>
    </Tooltip>
  );
}
function MainSidebar() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{ p: 2, borderRight: '1px solid black' }}
    >
      <img
        src="/logo.png"
        style={{ width: '32px', height: '32px', marginBottom: '32px' }}
        alt="logo"
      />
      <Stack direction="column">
        <NavItem label="Workflows" icon={sitemapOutline} url="/" />
        <NavItem label="Storage" icon={databaseIcon} url="/storage" />
      </Stack>
    </Stack>
  );
}
type NavItemProps = {
  label: string;
  icon: IconifyIcon;
  url: string;
};

export default MainSidebar;
