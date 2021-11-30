import { Fade } from '@mui/material'
import { Box } from '@mui/system'
import { SXMap } from '../MUITheme'
import { BirdieLoader } from './BirdieLoader'

export function InitializationOverlay(props: { hide: boolean }) {
  return (
    <Fade in={!props.hide} unmountOnExit appear={false}>
      <Box sx={styles.loaderContainer}>
        <BirdieLoader />
      </Box>
    </Fade>
  )
}

const styles: SXMap = {
  loaderContainer: { 
    display: 'flex',
    zIndex: theme => theme.zIndex.drawer + 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'fixed',
    inset: 0,
    backgroundColor: 'background.default' 
  }
}