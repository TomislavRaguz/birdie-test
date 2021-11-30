import { Container, Typography, Paper, Avatar, Box } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from "react-router-dom";
import { SXMap } from "../../MUITheme";

const CARE_RECIPIENT_IDS = [
  'df50cac5-293c-490d-a06c-ee26796f850d',
  'e3e2bff8-d318-4760-beea-841a75f00227',
  'ad3512a6-91b1-4d7d-a005-6f8764dd0111'
]

export function HomePage() {
  return (
    <Container>
      <Typography variant='h4' component="h1" sx={{ my: 2 }}>Birdie dev test app</Typography>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, maxWidth: 450, p: 1 }}>
          <Typography variant='h5'>My care recipients</Typography>
        </Box>
        {CARE_RECIPIENT_IDS.map((CARE_RECIPIENT_ID, i) => (
          <Link style={{ textDecoration: 'inherit' }} to={`/care-recipient/${CARE_RECIPIENT_ID}`}>
            <Paper sx={styles.recipientContainer}>
              <Avatar>CR</Avatar>
              <Typography sx={{ ml: 1 }}>Care recipient {i+1}</Typography>
              <ArrowForwardIosIcon sx={{ marginLeft: 'auto' }} />
            </Paper>
          </Link>
        ))}
      </Box>
      
    </Container>
  )
}

const styles: SXMap = {
  recipientContainer: { 
    my: 2, 
    p: 2, 
    py: 3, 
    maxWidth: 450, 
    display: 'flex', 
    alignItems: 'center' 
  }
}