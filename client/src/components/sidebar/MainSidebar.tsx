import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import sitemapOutline from '@iconify/icons-mdi/sitemap-outline';
import databaseIcon from '@iconify/icons-mdi/database';
import { Icon, IconifyIcon } from '@iconify/react';
import UserPopover from './UserPopover';
import { customStyled } from '@/theme/styled';

const EXPANDED_SIDEBAR_WIDTH = 180;
const COLLAPSED_SIDEBAR_WIDTH = 60;

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
  {
    id: 3,
    title: 'Logs',
    icon: <CustomIcon icon="icon-park-outline:log" />,
    url: '/logs',
  },
  {
    id: 4,
    title: 'Schedule',
    icon: <CustomIcon icon="ic:outline-schedule" />,
    url: '/schedules',
  },
  {
    id: 5,
    title: 'Connection',
    icon: <CustomIcon icon="mdi:connection" />,
    url: '/connections',
  },
];

function CustomIcon({ icon }: { icon: IconifyIcon | string }) {
  return <Icon style={{ fontSize: '20px' }} icon={icon} />;
}

function NavItem({ label, icon, url, isSelected, expanded }: NavItemProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(url);
  };
  return (
    <StyledNavItem expanded={expanded} selected={isSelected} onClick={onClick}>
      <ListItemIcon sx={{ width: 'fit-content', minWidth: 0 }}>
        {icon}
      </ListItemIcon>
      {expanded && <ListItemText style={{ margin: 0 }} primary={label} />}
    </StyledNavItem>
  );
}

function CollapseButton({
  onToggle,
  expanded,
}: {
  onToggle: () => void;
  expanded: boolean;
}) {
  return (
    <StyledCollapseButton expanded={expanded} size="small" onClick={onToggle}>
      <Icon icon="ic:baseline-chevron-right" />
    </StyledCollapseButton>
  );
}

function MainSidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<boolean>(true);
  const toggleSidebar = () => setExpanded((pre) => !pre);
  return (
    <StyledSidebar expanded={expanded} direction="column" alignItems="center">
      <img
        style={{ height: '50px' }}
        src="/public/logo-white.png"
        alt="auto-flow"
      />
      <List
        style={{ width: '100%', padding: '0px 16px', marginTop: '16px' }}
        aria-label="main mailbox folders"
      >
        {sidebarConfig?.map((tab) => (
          <NavItem
            key={tab?.id}
            label={tab?.title}
            icon={tab?.icon}
            url={tab?.url}
            isSelected={location?.pathname.startsWith(tab?.url)}
            expanded={expanded}
          />
        ))}
      </List>
      <Box sx={{ flex: 1 }} />
      <UserPopover />
      <CollapseButton expanded={expanded} onToggle={toggleSidebar} />
    </StyledSidebar>
  );
}

const StyledSidebar = styled(Stack)(({ theme, expanded }) => ({
  background: theme.palette.background.darkest,
  borderRight: `1px solid ${theme.palette.border.main}`,
  width: expanded ? EXPANDED_SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH,
  position: 'relative',
  transition: 'all 0.5s ease-in-out',
}));

const StyledNavItem = styled(ListItemButton)(({ theme, expanded }) => ({
  flexDirection: 'row',
  padding: '4px',
  gap: 8,
  borderRadius: '8px',
  minHeight: '32px',
  width: '100%',
}));

const StyledCollapseButton = styled(IconButton)(({ theme, expanded }) => ({
  position: 'absolute',
  right: '-15px',
  top: 50,
  border: `1px solid ${theme.palette.border.main}`,
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'all 0.5s ease-in-out',
  background: theme.palette.background.darkest,
}));

type NavItemProps = {
  label: string;
  icon: any;
  url: string;
  isSelected: boolean;
  expanded: boolean;
};

export default MainSidebar;
