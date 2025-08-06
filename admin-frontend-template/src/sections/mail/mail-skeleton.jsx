import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export function MailNavItemSkeleton({ itemCount = 6, sx, ...other }) {
  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        (theme) => ({
          py: 1,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          color: varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Skeleton variant="circular" sx={{ width: 32, height: 32, bgcolor: 'currentColor' }} />

      <Skeleton sx={{ width: 0.5, height: 10, bgcolor: 'currentColor' }} />
    </Box>
  ));
}

// ----------------------------------------------------------------------

export function MailItemSkeleton({ sx, itemCount = 6, ...other }) {
  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        {
          py: 1,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />

      <Box sx={{ flex: '1 1 auto' }}>
        <Skeleton sx={{ mb: 1, width: 0.75, height: 10 }} />
        <Skeleton sx={{ width: 0.5, height: 10 }} />
      </Box>
    </Box>
  ));
}
