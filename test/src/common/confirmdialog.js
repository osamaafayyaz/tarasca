import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';





export function PassphraseDialog(props){
  const { passphrase, ...other } = props;
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Confirm Passphrase Backup</DialogTitle>
      <DialogContent>
        <Typography>
          Write down your passphrase (in the box) and store it somewhere safe.
        </Typography>
      </DialogContent>
      <DialogContent className="boxed">
        <Typography gutterBottom variant="body2" color="error">
          {passphrase}
        </Typography>
      </DialogContent>
      <DialogContent>
        <Typography gutterBottom>
          By selecting Ok you disable the backup reminder after login. Select Cancel to keep the reminder.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={props.handleToggle} >
          Cancel
        </Button>
        <Button variant="outlined" onClick={props.handleConfirmed}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
