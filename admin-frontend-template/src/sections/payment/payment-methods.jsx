import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

import { PaymentCardCreateForm } from './payment-card-create-form';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  { label: 'Paypal', value: 'paypal' },
  { label: 'Credit / debit', value: 'creditcard' },
];

const CARD_OPTIONS = [
  { value: 'visa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'visa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'mastercard', label: '**** **** **** 4545 - Cole Armstrong' },
];

// ----------------------------------------------------------------------

export function PaymentMethods({ sx, ...other }) {
  const openForm = useBoolean();

  const [method, setMethod] = useState('paypal');

  const handleChangeMethod = useCallback((newValue) => {
    setMethod(newValue);
  }, []);

  const renderCardCreateFormDialog = () => (
    <Dialog fullWidth maxWidth="xs" open={openForm.value} onClose={openForm.onFalse}>
      <DialogTitle>Add card</DialogTitle>

      <PaymentCardCreateForm sx={{ px: 3 }} />

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={openForm.onFalse}>
          Cancel
        </Button>
        <Button color="inherit" variant="contained" onClick={openForm.onFalse}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Box sx={sx} {...other}>
        <Typography component="h6" variant="h5" sx={{ mb: { xs: 3, md: 5 } }}>
          Payment method
        </Typography>

        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = method === option.value;

            return (
              <OptionItem
                key={option.label}
                option={option}
                selected={isSelected}
                onOpen={openForm.onTrue}
                isCredit={isSelected && option.value === 'creditcard'}
                onClick={() => handleChangeMethod(option.value)}
              />
            );
          })}
        </Box>
      </Box>

      {renderCardCreateFormDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function OptionItem({ option, onOpen, selected, isCredit, sx, ...other }) {
  return (
    <Box
      sx={[
        (theme) => ({
          borderRadius: 1.5,
          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
          transition: theme.transitions.create(['box-shadow'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
          ...(selected && { boxShadow: `0 0 0 2px ${theme.vars.palette.text.primary}` }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          px: 2,
          gap: 2,
          height: 80,
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
        }}
      >
        <Iconify
          width={24}
          icon={selected ? 'solar:check-circle-bold' : 'eva:radio-button-off-fill'}
          sx={{ color: 'text.disabled', ...(selected && { color: 'primary.main' }) }}
        />

        <Box component="span" sx={{ typography: 'subtitle1', flexGrow: 1 }}>
          {option.label}
        </Box>

        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          {option.value === 'creditcard' ? (
            <>
              <Iconify icon="payments:mastercard" width={36} height="auto" />
              <Iconify icon="payments:visa" width={36} height="auto" />
            </>
          ) : (
            <Iconify icon="payments:paypal" width={24} />
          )}
        </Box>
      </Box>

      {isCredit && (
        <Box sx={{ px: 3 }}>
          <TextField select fullWidth label="Card" slotProps={{ select: { native: true } }}>
            {CARD_OPTIONS.map((card) => (
              <option key={card.value} value={card.value}>
                {card.label}
              </option>
            ))}
          </TextField>

          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpen}
            sx={{ my: 3 }}
          >
            Add card
          </Button>
        </Box>
      )}
    </Box>
  );
}
