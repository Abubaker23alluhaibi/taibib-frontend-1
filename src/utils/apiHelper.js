// API Helper for Tabib IQ Frontend
// Helps build correct API URLs with fallback support

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.tabib-iq.com';

// Fallback URLs in case of issues
const FALLBACK_URLS = [
  'https://api.tabib-iq.com',
  'https://tabib-iq-backend-production.up.railway.app'
];

/**
 * Builds a correct API URL with proper endpoint handling
 * @param {string} endpoint - The API endpoint (e.g., '/doctors', '/auth/login')
 * @param {string} baseUrl - Optional base URL, defaults to REACT_APP_API_URL
 * @returns {string} The complete API URL
 */
export function buildApiUrl(endpoint, baseUrl = API_BASE_URL) {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // تنظيف URL من /api/health إذا كان موجوداً
  const cleanBaseUrl = baseUrl.replace('/api/health', '');
  
  // Handle different URL patterns
  if (cleanBaseUrl.endsWith('/api')) {
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  } else {
    return `${cleanBaseUrl}/api/${cleanEndpoint}`;
  }
}

/**
 * Makes an API request with fallback support
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const urls = [API_BASE_URL, ...FALLBACK_URLS];
  
  for (const url of urls) {
    try {
      const fullUrl = buildApiUrl(endpoint, url);
      console.log(`🔍 محاولة الاتصال بـ: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (response.ok) {
        console.log(`✅ نجح الاتصال بـ: ${url}`);
        const data = await response.json();
        return { success: true, data, url: fullUrl };
      }
    } catch (error) {
      console.log(`❌ فشل الاتصال بـ ${url}:`, error.message);
      continue;
    }
  }
  
  throw new Error('فشل الاتصال بجميع الخوادم');
}

/**
 * Makes a FormData API request with fallback support
 * @param {string} endpoint - The API endpoint
 * @param {FormData} formData - Form data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export async function apiFormDataRequest(endpoint, formData, options = {}) {
  const urls = [API_BASE_URL, ...FALLBACK_URLS];
  
  for (const url of urls) {
    try {
      const fullUrl = buildApiUrl(endpoint, url);
      console.log(`🔍 محاولة الاتصال بـ: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        ...options
      });

      if (response.ok) {
        console.log(`✅ نجح الاتصال بـ: ${url}`);
        const data = await response.json();
        return { success: true, data, url: fullUrl };
      }
    } catch (error) {
      console.log(`❌ فشل الاتصال بـ ${url}:`, error.message);
      continue;
    }
  }
  
  throw new Error('فشل الاتصال بجميع الخوادم');
}

/**
 * Gets the base URL for image uploads
 * @param {string} imagePath - Image path starting with /uploads/
 * @returns {string} Complete image URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  
  // Try primary URL first - تنظيف URL من /api/health
  const cleanBaseUrl = API_BASE_URL.replace('/api/health', '');
  const primaryUrl = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl.replace('/api', '') : cleanBaseUrl;
  return `${primaryUrl}${imagePath}`;
}

export default {
  buildApiUrl,
  apiRequest,
  apiFormDataRequest,
  getImageUrl
}; 