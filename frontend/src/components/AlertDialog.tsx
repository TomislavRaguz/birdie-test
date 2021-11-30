import React, { useImperativeHandle, useState } from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  Button, 
  DialogTitle, 
  DialogContentText 
} from "@mui/material";

export const AlertDialog = React.forwardRef((props: {}, ref) => {
  const [dialogState, setDialogState] = useState(null as null | DialogParams)
  useImperativeHandle(ref, () => ({
    show: (dialogParams: DialogParams) => {
      setDialogState(dialogParams)
    },
    hide: () => {
      setDialogState(null)
    }
  }))

  if(!dialogState) return null;

  return (
    <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogState.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!dialogState.dialogActions.length ? (
            <Button onClick={() => setDialogState(null)} color="primary">
              OK
            </Button>
            ):(
              dialogState.dialogActions.map(dialogAction => (
                <Button key={dialogAction.label} onClick={() => { dialogAction.onClick(); setDialogState(null)}} color="primary">
                  {dialogAction.label}
                </Button>
              ))
            )
          }
        </DialogActions>
      </Dialog>
  )
})

interface DialogParams {
  title: string,
  content: string,
  dialogActions: Array<{
    label: string
    onClick: () => void
  }>
}

export const alertDialogRef = React.createRef<{
  show: (dialogParams: DialogParams) => void
  hide: () => void
}>()