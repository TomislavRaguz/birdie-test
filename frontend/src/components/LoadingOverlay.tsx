import { Backdrop } from "@mui/material";
import React, { useImperativeHandle, useState } from "react"
import { BirdieLoader } from "./BirdieLoader";

export const LoadingOverlay = React.forwardRef((props: {}, ref) => {
  const [display, setDisplay] = useState(false)
  useImperativeHandle(ref, () => ({
    show: () => {
      setDisplay(true)
    },
    hide: () => {
      setDisplay(false)
    }
  }))
  if(!display) return null;
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.tooltip + 1 }}
      open={display}
      onClick={() => setDisplay(false)}
    >
      <BirdieLoader />
    </Backdrop>
  )
})

export const loadingOverlayRef = React.createRef<{
  show: () => void;
  hide: () => void;
}>()