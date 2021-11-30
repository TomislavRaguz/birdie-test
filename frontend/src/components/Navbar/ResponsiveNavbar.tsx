import React from 'react';
import { Box, useTheme } from "@mui/material";

export const ResponsiveNavbar = (props : {
  desktopNav: JSX.Element
  mobileNav: JSX.Element
}) => {
  const { desktopNav, mobileNav } = props;
  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}> 
        <Box 
          sx={{
            position: 'fixed', 
            width: '100%',
            height: th => th.desktopNavigationHeight,
            zIndex: 'appBar'
          }}
          component="nav"
        >
          {desktopNav}
        </Box>
        <Box sx={{ height: th => th.desktopNavigationHeight }} />
      </Box>

      <Box sx={{ display: { md: 'none' } }}>
        <Box
          sx={{
            position: 'fixed', 
            width: '100%',
            height: th => th.mobileNavigationHeight,
            zIndex: 'appBar'
          }}
          component="nav"
        >
          {mobileNav}
        </Box>
        <Box sx={{ height: th => th.mobileNavigationHeight }} />
      </Box>
    </>
  )
}
