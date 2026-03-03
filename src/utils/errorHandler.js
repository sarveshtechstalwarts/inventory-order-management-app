export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      message: data?.message || `Error ${status}: ${error.message}`,
      status,
      data: data?.errors || null,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};

export const getErrorMessage = (error) => {
  const handled = handleApiError(error);
  return handled.message;
};
