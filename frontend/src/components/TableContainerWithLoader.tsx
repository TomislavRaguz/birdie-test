import { Fade } from "@mui/material";
import { Box } from "@mui/system";
import { ResponsiveContainer } from "recharts";
import { SXMap } from "../MUITheme";
import { BirdieLoader } from "./BirdieLoader";

export function ResponsiveContainerWithLoader(props: { height: number, children: JSX.Element, isUpdating?: boolean }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={props.height}>
        {props.children}
      </ResponsiveContainer>
      <Fade in={props.isUpdating}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <Box sx={styles.loaderContainer}>
            <BirdieLoader />
          </Box>
        </Box>
      </Fade>
    </Box>
  )
}

const styles: SXMap = {
  loaderContainer: { 
    position: 'absolute',
    top: '50%',  
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fill: "primary.main" 
  }
}