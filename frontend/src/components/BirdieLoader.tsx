import { CircularProgress } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Bird } from "./Bird";

export function BirdieLoader () {
  return (
    <Box sx={{ width: 100, height: 100, position: 'relative' }}>
      <CircularProgress color="inherit" size="large"/>
      <BirdLoader
        size={50}
      />
    </Box>
  )
}

const BirdLoader = styled(Bird)({
  position: 'absolute',
  top: '50%',  
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fill: "primary.main"
})