import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { Bird } from '../Bird';
import { SXMap } from '../../MUITheme';

export function DesktopNav(props: {}) {
  return (
    <Box sx={styles.fullWidthContainer}>
      <Container sx={{ height: '100%' }}>
        <Box sx={styles.rootNavContainer}>
          <NavLink to='/' style={{ textDecoration: 'none' }}>
            <Box sx={styles.logoContainer}>
              <Bird size={60} />
              <Typography variant="h4" color="black">Birdie</Typography>
            </Box>
          </NavLink>
        </Box>
      </Container>
    </Box>
  )
}

const styles: SXMap = {
  fullWidthContainer: {
    borderBottom: 1, 
    height: '100%', 
    backgroundColor: 'background.default'
  },
  rootNavContainer: {
    display: 'flex', 
    flex: 1, 
    height: '100%',
    backgroundColor: 'background.default'
  },
  logoContainer: {
    height: '100%',
    width: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}