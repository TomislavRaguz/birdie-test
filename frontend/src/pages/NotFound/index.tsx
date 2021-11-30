import { Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box sx={{ minHeight: theme => `calc(100vh - ${theme.desktopNavigationHeight}px)`, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
      <Typography variant='h5'>Page not found</Typography>
      <Button sx={{ my: 2 }} component={Link} to='/' variant="outlined">
        Back to home
      </Button>
    </Box>
  )
}

