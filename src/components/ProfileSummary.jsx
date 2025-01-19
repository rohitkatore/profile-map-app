import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map from './Map';

const ProfileSummary = ({ profile, open, onClose }) => {
  if (!profile) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          height: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        Profile Summary
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src={profile.photo}
                  alt={profile.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    marginRight: '16px',
                    objectFit: 'cover'
                  }}
                />
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {profile.description}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                {profile.address}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Interests
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {profile.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '400px', width: '100%' }}>
              <Map selectedProfile={profile} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSummary;
