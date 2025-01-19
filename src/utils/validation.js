export const validateProfile = (profile) => {
  const errors = {};

  // Name validation
  if (!profile.name) {
    errors.name = 'Name is required';
  } else if (profile.name.length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  // Description validation
  if (!profile.description) {
    errors.description = 'Description is required';
  } else if (profile.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  // Address validation
  if (!profile.address) {
    errors.address = 'Address is required';
  } else if (profile.address.length < 5) {
    errors.address = 'Please enter a valid address';
  }

  // Photo URL validation
  if (profile.photo && !isValidUrl(profile.photo)) {
    errors.photo = 'Please enter a valid URL for the photo';
  }

  // Interests validation
  if (profile.interests && !Array.isArray(profile.interests)) {
    errors.interests = 'Interests must be an array';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const parseInterests = (interestsString) => {
  if (!interestsString) return [];
  return interestsString
    .split(/\s*,\s*/) // Split by comma with optional whitespace
    .map(interest => interest.trim())
    .filter(interest => interest.length > 0);
};

export const geocodeAddress = async (address) => {
  if (!window.google) {
    throw new Error('Google Maps not loaded. Please try again.');
  }

  try {
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          resolve({
            address: results[0].formatted_address,
            location
          });
        } else {
          reject(new Error('Could not find the location. Please check the address.'));
        }
      });
    });
  } catch (error) {
    throw new Error(`Error geocoding address: ${error.message}`);
  }
};

export const handleApiError = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return {
      title: 'No Internet Connection',
      message: 'Please check your internet connection and try again.'
    };
  }

  // Google Maps specific errors
  if (error.message.includes('Google Maps')) {
    return {
      title: 'Map Service Error',
      message: error.message
    };
  }

  // Geocoding errors
  if (error.message.includes('geocoding') || error.message.includes('location')) {
    return {
      title: 'Address Error',
      message: error.message
    };
  }

  // Default error
  return {
    title: 'Something went wrong',
    message: error.message || 'An unexpected error occurred. Please try again.'
  };
};
