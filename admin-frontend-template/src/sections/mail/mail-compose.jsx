import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const POSITION = 20;

export function MailCompose({ onCloseCompose }) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const fullScreen = useBoolean();

  const [message, setMessage] = useState('');

  const handleChangeMessage = useCallback((value) => {
    setMessage(value);
  }, []);

  useEffect(() => {
    document.body.style.overflow = fullScreen.value ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen.value]);

  return (
    <Portal>
      {(fullScreen.value || !smUp) && (
        <Backdrop open sx={[(theme) => ({ zIndex: theme.zIndex.modal - 1 })]} />
      )}

      <Paper
        sx={[
          (theme) => ({
            maxWidth: 560,
            right: POSITION,
            borderRadius: 2,
            display: 'flex',
            bottom: POSITION,
            position: 'fixed',
            overflow: 'hidden',
            flexDirection: 'column',
            zIndex: theme.zIndex.modal,
            width: `calc(100% - ${POSITION * 2}px)`,
            boxShadow: theme.vars.customShadows.dropdown,
            ...(fullScreen.value && { maxWidth: 1, height: `calc(100% - ${POSITION * 2}px)` }),
          }),
        ]}
      >
        <Box
          sx={[
            (theme) => ({
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.neutral',
              p: theme.spacing(1.5, 1, 1.5, 2),
            }),
          ]}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            New message
          </Typography>

          <IconButton onClick={fullScreen.onToggle}>
            <Iconify icon={fullScreen.value ? 'eva:collapse-fill' : 'eva:expand-fill'} />
          </IconButton>

          <IconButton onClick={onCloseCompose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <InputBase
          id="mail-compose-to"
          placeholder="To"
          endAdornment={
            <Box sx={{ gap: 0.5, display: 'flex', typography: 'subtitle2' }}>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cc</Box>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Bcc</Box>
            </Box>
          }
          sx={[
            (theme) => ({
              px: 2,
              height: 48,
              borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        />

        <InputBase
          id="mail-compose-subject"
          placeholder="Subject"
          sx={[
            (theme) => ({
              px: 2,
              height: 48,
              borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        />

        <Box
          sx={{
            p: 2,
            gap: 2,
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <Editor
            value={message}
            onChange={handleChangeMessage}
            placeholder="Type a message"
            slotProps={{
              wrapper: { ...(fullScreen.value && { minHeight: 0, flex: '1 1 auto' }) },
            }}
            sx={{
              maxHeight: 480,
              ...(fullScreen.value && { maxHeight: 1, flex: '1 1 auto' }),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              color="primary"
              endIcon={<Iconify icon="custom:send-fill" />}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Portal>
  );
}
