import React, { useState } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Typography,
  Stack,
  Button,
  Fade
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';

const SearchFilters = ({ profiles, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    selectedInterests: [],
    location: '',
    sortBy: 'name'
  });

  // Extract unique interests and locations from profiles
  const allInterests = [...new Set(profiles.flatMap(profile => profile.interests))];
  const allLocations = [...new Set(profiles.map(profile => profile.address))];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchText: '',
      selectedInterests: [],
      location: '',
      sortBy: 'name'
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const applyFilters = (currentFilters) => {
    let filteredProfiles = [...profiles];

    // Text search across name and description
    if (currentFilters.searchText) {
      const searchLower = currentFilters.searchText.toLowerCase();
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchLower) ||
        profile.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by interests
    if (currentFilters.selectedInterests.length > 0) {
      filteredProfiles = filteredProfiles.filter(profile =>
        currentFilters.selectedInterests.some(interest =>
          profile.interests.includes(interest)
        )
      );
    }

    // Filter by location
    if (currentFilters.location) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.address.toLowerCase().includes(currentFilters.location.toLowerCase())
      );
    }

    // Sort profiles
    filteredProfiles.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.address.localeCompare(b.address);
        default:
          return 0;
      }
    });

    onFilterChange(filteredProfiles);
  };

  const hasActiveFilters = filters.selectedInterests.length > 0 || filters.location || filters.searchText;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name or description..."
          value={filters.searchText}
          onChange={(e) => handleFilterChange('searchText', e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            endAdornment: filters.searchText && (
              <IconButton size="small" onClick={() => handleFilterChange('searchText', '')}>
                <ClearIcon />
              </IconButton>
            ),
            sx: {
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'background.default'
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider'
              }
            }
          }}
        />
        <Button
          onClick={() => setShowFilters(!showFilters)}
          color={showFilters ? 'primary' : 'inherit'}
          startIcon={<TuneIcon />}
          sx={{ 
            ml: 2,
            minWidth: 100,
            borderRadius: 2,
            px: 2
          }}
          variant={showFilters ? 'contained' : 'outlined'}
        >
          Filters
          {hasActiveFilters && (
            <Chip
              size="small"
              label={filters.selectedInterests.length + (filters.location ? 1 : 0)}
              sx={{ 
                ml: 1,
                height: 20,
                minWidth: 20
              }}
              color="primary"
            />
          )}
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Fade in={showFilters}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Filter Options
            </Typography>
            
            <Autocomplete
              multiple
              options={allInterests}
              value={filters.selectedInterests}
              onChange={(_, newValue) => handleFilterChange('selectedInterests', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Filter by Interests"
                  placeholder="Select interests"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  />
                ))
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <Autocomplete
              options={allLocations}
              value={filters.location}
              onChange={(_, newValue) => handleFilterChange('location', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Location"
                  placeholder="Select location"
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="location">Location</MenuItem>
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  color="inherit"
                  sx={{ 
                    borderRadius: 2,
                    color: 'text.secondary'
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}
          </Stack>
        </Fade>
      </Collapse>
    </Paper>
  );
};

export default SearchFilters;
