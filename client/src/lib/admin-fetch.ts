/**
 * Helper function for authenticated admin API calls
 * Automatically includes the admin Bearer token from localStorage
 */
export async function adminFetch(url: string, options: RequestInit = {}) {
  const adminToken = localStorage.getItem('adminToken');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${adminToken}`
  };

  return fetch(url, {
    ...options,
    headers
  });
}

/**
 * Helper for JSON POST/PATCH/DELETE requests
 */
export async function adminRequest(url: string, method: string, body?: any) {
  const adminToken = localStorage.getItem('adminToken');
  
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
}
