import { Box } from "@mui/system";
import { SXMap } from "../MUITheme";
import { BirdieLoader } from "./BirdieLoader";

export function LoadingView() {
  return (
    <Box sx={styles.loaderContainer}>
      <BirdieLoader />
    </Box>
  )
}

const styles: SXMap = {
  loaderContainer: { 
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%',
    width: "100%",
    minHeight: 500,
    backgroundColor: 'background.default' 
  }
}