import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { editorClasses } from '../classes';
import { ToolbarItem } from './toolbar-item';

// ----------------------------------------------------------------------

export function LinkBlock({ editor, icons }) {
  const [url, setUrl] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    const previousUrl = editor?.getAttributes('link').href;

    setAnchorEl(event.currentTarget);

    if (previousUrl) {
      setUrl(previousUrl);
    } else {
      setUrl('');
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleUpdateUrl = useCallback(() => {
    handleClosePopover();

    if (!url) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor, url]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <ToolbarItem
        aria-label="Link"
        active={editor.isActive('link')}
        className={editorClasses.toolbar.link}
        onClick={handleOpenPopover}
        icon={icons?.link}
      />

      <ToolbarItem
        aria-label="Unset link"
        disabled={!editor.isActive('link')}
        className={editorClasses.toolbar.unsetlink}
        onClick={() => editor.chain().focus().unsetLink().run()}
        icon={icons?.unsetLink}
      />

      <Popover
        id={anchorEl ? 'simple-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2.5 } } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          URL
        </Typography>

        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Enter URL here..."
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            sx={{ width: 240 }}
          />
          <Button variant="contained" onClick={handleUpdateUrl}>
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
