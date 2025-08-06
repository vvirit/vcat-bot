import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function Toolbar({
  sx,
  isText,
  isMultiple,
  onRefresh,
  onChangeText,
  onChangeMultiple,
  ...other
}) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <FormControlLabel
        label="Text object"
        control={
          <Switch
            checked={isText}
            onChange={onChangeText}
            slotProps={{ input: { id: 'text-switch' } }}
          />
        }
      />

      <Box sx={{ flexGrow: 1 }} />
      {!isText && (
        <FormControlLabel
          label="MultiItem"
          control={
            <Switch
              checked={isMultiple}
              onChange={onChangeMultiple}
              slotProps={{ input: { id: 'multi-item-switch' } }}
            />
          }
        />
      )}
      <IconButton onClick={onRefresh}>
        <Iconify icon="solar:restart-bold" />
      </IconButton>
    </Box>
  );
}
