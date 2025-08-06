import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { _faqs } from 'src/_mock';

// ----------------------------------------------------------------------

export function FaqsList({ sx, ...other }) {
  return (
    <Box sx={sx} {...other}>
      {_faqs.map((item) => (
        <Accordion key={item.id}>
          <AccordionSummary
            id={`faqs-panel${item.id}-header`}
            aria-controls={`faqs-panel${item.id}-content`}
          >
            <Typography component="span" variant="subtitle1">
              {item.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: 'text.secondary' }}>{item.content}</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
