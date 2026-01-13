// Helper function to get Thai timezone timestamp
const getThaiTimestamp = () => {
  return new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const apiResponse = {
  success: (data, meta = {}) => ({
    success: true,
    data,
    meta: {
      timestamp: getThaiTimestamp(),
      ...meta,
    },
  }),
  error: (code, message, details = null) => ({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: getThaiTimestamp(),
    },
  }),
  paginated: (data, page, size, hasMore) => ({
    success: true,
    data,
    meta: {
      timestamp: getThaiTimestamp(),
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        hasMore,
      },
    },
  }),
};
