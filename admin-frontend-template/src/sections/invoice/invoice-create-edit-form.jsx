import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { today, fIsAfter } from 'src/utils/format-time';

import { _addressBooks } from 'src/_mock';

import { Form, schemaHelper } from 'src/components/hook-form';

import { InvoiceCreateEditAddress } from './invoice-create-edit-address';
import { InvoiceCreateEditStatusDate } from './invoice-create-edit-status-date';
import { defaultItem, InvoiceCreateEditDetails } from './invoice-create-edit-details';

// ----------------------------------------------------------------------

export const InvoiceCreateSchema = zod
  .object({
    invoiceTo: schemaHelper.nullableInput(zod.custom(), {
      message: 'Invoice to is required!',
    }),
    createDate: schemaHelper.date({ message: { required: 'Create date is required!' } }),
    dueDate: schemaHelper.date({ message: { required: 'Due date is required!' } }),
    items: zod.array(
      zod.object({
        title: zod.string().min(1, { message: 'Title is required!' }),
        service: zod.string().min(1, { message: 'Service is required!' }),
        quantity: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
        // Not required
        price: zod.number(),
        total: zod.number(),
        description: zod.string(),
      })
    ),
    // Not required
    taxes: zod.number(),
    status: zod.string(),
    discount: zod.number(),
    shipping: zod.number(),
    subtotal: zod.number(),
    totalAmount: zod.number(),
    invoiceNumber: zod.string(),
    invoiceFrom: zod.custom().nullable(),
  })
  .refine((data) => !fIsAfter(data.createDate, data.dueDate), {
    message: 'Due date cannot be earlier than create date!',
    path: ['dueDate'],
  });

// ----------------------------------------------------------------------

export function InvoiceCreateEditForm({ currentInvoice }) {
  const router = useRouter();

  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const defaultValues = {
    invoiceNumber: 'INV-1990',
    createDate: today(),
    dueDate: null,
    taxes: 0,
    shipping: 0,
    status: 'draft',
    discount: 0,
    invoiceFrom: _addressBooks[0],
    invoiceTo: null,
    subtotal: 0,
    totalAmount: 0,
    items: [defaultItem],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(InvoiceCreateSchema),
    defaultValues,
    values: currentInvoice,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <InvoiceCreateEditAddress />
        <InvoiceCreateEditStatusDate />
        <InvoiceCreateEditDetails />
      </Card>

      <Box
        sx={{
          mt: 3,
          gap: 2,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as draft
        </Button>

        <Button
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? 'Update' : 'Create'} & send
        </Button>
      </Box>
    </Form>
  );
}
