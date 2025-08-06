import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ProductCreateSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper
    .editor({ message: 'Description is required!' })
    .min(100, { message: 'Description must be at least 100 characters' }),
  images: schemaHelper.files({ message: 'Images is required!' }),
  code: zod.string().min(1, { message: 'Product code is required!' }),
  sku: zod.string().min(1, { message: 'Product sku is required!' }),
  quantity: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Quantity is required!' }),
    {
      // message for null value
      message: 'Quantity is required!',
    }
  ),
  colors: zod.string().array().min(1, { message: 'Choose at least one option!' }),
  sizes: zod.string().array().min(1, { message: 'Choose at least one option!' }),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  gender: zod.array(zod.string()).min(1, { message: 'Choose at least one option!' }),
  price: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Price is required!' }),
    {
      // message for null value
      message: 'Price is required!',
    }
  ),
  // Not required
  category: zod.string(),
  subDescription: zod.string(),
  taxes: zod.number({ coerce: true }).nullable(),
  priceSale: zod.number({ coerce: true }).nullable(),
  saleLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
  newLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
});

// ----------------------------------------------------------------------

export function ProductCreateEditForm({ currentProduct }) {
  const router = useRouter();

  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);
  const openPricing = useBoolean(true);

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = {
    name: '',
    description: '',
    subDescription: '',
    images: [],
    /********/
    code: '',
    sku: '',
    price: null,
    taxes: null,
    priceSale: null,
    quantity: null,
    tags: [],
    gender: [],
    category: PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
    colors: [],
    sizes: [],
    newLabel: { enabled: false, content: '' },
    saleLabel: { enabled: false, content: '' },
  };

  const methods = useForm({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, short description, image..."
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="name" label="Product name" />

          <Field.Text name="subDescription" label="Sub description" multiline rows={4} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <Field.Editor name="description" sx={{ maxHeight: 480 }} />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <Field.Upload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text name="code" label="Product code" />

            <Field.Text name="sku" label="Product SKU" />

            <Field.Text
              name="quantity"
              label="Quantity"
              placeholder="0"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Select
              name="category"
              label="Category"
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Field.Select>

            <Field.MultiSelect
              checkbox
              name="colors"
              label="Colors"
              options={PRODUCT_COLOR_NAME_OPTIONS}
            />

            <Field.MultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
          </Box>

          <Field.Autocomplete
            name="tags"
            label="Tags"
            placeholder="+ Tags"
            multiple
            freeSolo
            disableCloseOnSelect
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            slotProps={{
              chip: { color: 'info' },
            }}
          />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Gender</Typography>
            <Field.MultiCheckbox
              row
              name="gender"
              options={PRODUCT_GENDER_OPTIONS}
              sx={{ gap: 2 }}
            />
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ gap: 3, display: 'flex', alignItems: 'center' }}>
            <Field.Switch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
            <Field.Text
              name="saleLabel.content"
              label="Sale label"
              fullWidth
              disabled={!values.saleLabel.enabled}
            />
          </Box>

          <Box sx={{ gap: 3, display: 'flex', alignItems: 'center' }}>
            <Field.Switch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
            <Field.Text
              name="newLabel.content"
              label="New label"
              fullWidth
              disabled={!values.newLabel.enabled}
            />
          </Box>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <CardHeader
        title="Pricing"
        subheader="Price related inputs"
        action={renderCollapseButton(openPricing.value, openPricing.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openPricing.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text
            name="price"
            label="Regular price"
            placeholder="0.00"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.75 }}>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="priceSale"
            label="Sale price"
            placeholder="0.00"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.75 }}>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                id="toggle-taxes"
                checked={includeTaxes}
                onChange={handleChangeIncludeTaxes}
              />
            }
            label="Price includes taxes"
          />

          {!includeTaxes && (
            <Field.Text
              name="taxes"
              label="Tax (%)"
              placeholder="0.00"
              type="number"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.75 }}>
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <FormControlLabel
        label="Publish"
        control={<Switch defaultChecked slotProps={{ input: { id: 'publish-switch' } }} />}
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderPricing()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
