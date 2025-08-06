import { useState } from 'react';

import Box from '@mui/material/Box';

import { ColorPicker, ColorPreview } from 'src/components/color-utils';

import { ComponentBox } from '../../layout';

// ----------------------------------------------------------------------

const COLORS = [
  '#FF9800',
  '#673AB7',
  '#8BC34A',
  '#009688',
  '#3F51B5',
  '#03A9F4',
  '#607D8B',
  '#4CAF50',
  '#00BCD4',
  '#CDDC39',
  '#E91E63',
  '#FFC107',
  '#9C27B0',
  '#FF5722',
  '#795548',
  '#2196F3',
  '#9E9E9E',
  '#F44336',
  '#FFEB3B',
];

// ----------------------------------------------------------------------

export function ColorPickers() {
  const [singleColor, setSingleColor] = useState(COLORS[0]);
  const [multipleColors, setMultipleColors] = useState([COLORS[7], COLORS[8]]);

  const renderDisplayValue = (value) => (
    <Box
      component="span"
      sx={{ width: 1, display: 'block', typography: 'body2', textAlign: 'center' }}
    >
      {value}
    </Box>
  );

  return (
    <>
      <ComponentBox title="Single">
        <ColorPicker
          options={COLORS.slice(0, 6)}
          value={singleColor}
          onChange={(newValue) => setSingleColor(newValue)}
        />
        {renderDisplayValue(singleColor)}
      </ComponentBox>

      <ComponentBox title="Multiple">
        <ColorPicker
          limit={6}
          variant="rounded"
          options={COLORS.slice(0, 16)}
          value={multipleColors}
          onChange={(newValue) => setMultipleColors(newValue)}
        />
        {renderDisplayValue(JSON.stringify(multipleColors, null, 2))}
      </ComponentBox>

      <ComponentBox title="Preview">
        <ColorPreview colors={COLORS} limit={6} />
      </ComponentBox>
    </>
  );
}
