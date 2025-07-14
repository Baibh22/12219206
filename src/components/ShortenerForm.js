import { useState } from 'react';
import { Button, TextField, Grid, Alert, Box } from '@mui/material';
import { Log } from '../utils/logger';
import { storeUrl } from '../utils/storage';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ShortenerForm() {
  const [inputs, setInputs] = useState([{ original: '', validity: 30, shortCode: '' }]);
  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- ./?%&=]*)?$/;
    return pattern.test(url);
  };

  const validateShortCode = (code) => {
    return !code || /^[a-zA-Z0-9_-]{4,20}$/.test(code);
  };

  const handleSubmit = async (index) => {
    try {
      const input = inputs[index];
      const newErrors = {};

      if (!validateUrl(input.original)) {
        newErrors.original = 'Invalid URL format';
        Log('frontend', 'warn', 'api', 'Invalid URL format submitted');
      }

      if (!validateShortCode(input.shortCode)) {
        newErrors.shortCode = 'Shortcode must be 4-20 alphanumeric characters';
        Log('frontend', 'warn', 'api', 'Invalid shortcode format');
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors({ ...errors, [index]: newErrors });
        return;
      }

      await storeUrl({
        original: input.original,
        validity: input.validity,
        shortCode: input.shortCode || generateShortCode(),
      });

      Log('frontend', 'info', 'api', 'URL successfully shortened');
      setInputs([...inputs, { original: '', validity: 30, shortCode: '' }].slice(0, 5));

    } catch (error) {
      Log('frontend', 'error', 'api', 'URL submission failed', {
        error: error.message
      });
      setErrors({ ...errors, [index]: { form: error.message } });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {inputs.map((input, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original URL"
                value={input.original}
                onChange={(e) => handleInputChange(index, 'original', e.target.value)}
                error={!!errors[index]?.original}
                helperText={errors[index]?.original}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Validity (minutes)"
                type="number"
                value={input.validity}
                onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                label="Custom Shortcode (optional)"
                value={input.shortCode}
                onChange={(e) => handleInputChange(index, 'shortCode', e.target.value)}
                error={!!errors[index]?.shortCode}
                helperText={errors[index]?.shortCode}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button 
                variant="contained" 
                onClick={() => handleSubmit(index)}
                fullWidth
              >
                Shorten
              </Button>
            </Grid>
          </Grid>
          {errors[index]?.form && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors[index].form}
            </Alert>
          )}
        </Paper>
      ))}
    </Box>
  );
}

// Inside the success display section
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Typography>{shortUrl}</Typography>
  <IconButton
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(shortUrl);
        Log('frontend', 'info', 'api', 'Copied short URL to clipboard');
      } catch (error) {
        Log('frontend', 'error', 'api', 'Copy to clipboard failed', {
          error: error.message
        });
      }
    }}
  >
    <ContentCopyIcon fontSize="small" />
  </IconButton>
</Box>