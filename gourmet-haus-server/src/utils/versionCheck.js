// Version check utility to detect new deployments
export const checkForUpdates = async () => {
  try {
    // Add timestamp to bypass cache
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) return null;
    
    const remoteVersion = await response.json();
    const localVersion = localStorage.getItem('app_version');
    const localTimestamp = localStorage.getItem('app_timestamp');
    
    // First time visitor - store version
    if (!localVersion || !localTimestamp) {
      localStorage.setItem('app_version', remoteVersion.version);
      localStorage.setItem('app_timestamp', remoteVersion.timestamp.toString());
      return null;
    }
    
    // Check if remote version is newer
    const isNewVersion = remoteVersion.timestamp > parseInt(localTimestamp);
    
    if (isNewVersion) {
      return {
        currentVersion: localVersion,
        newVersion: remoteVersion.version,
        timestamp: remoteVersion.timestamp
      };
    }
    
    return null;
  } catch (error) {
    console.error('Version check failed:', error);
    return null;
  }
};

// Aggressive version check that runs on EVERY page load
export const forceVersionCheck = async () => {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) return false;
    
    const remoteVersion = await response.json();
    const localTimestamp = localStorage.getItem('app_timestamp');
    
    // If no local version or remote is newer, force update
    if (!localTimestamp || remoteVersion.timestamp > parseInt(localTimestamp)) {
      localStorage.setItem('app_version', remoteVersion.version);
      localStorage.setItem('app_timestamp', remoteVersion.timestamp.toString());
      
      // If local version existed and was older, force reload
      if (localTimestamp && remoteVersion.timestamp > parseInt(localTimestamp)) {
        return true; // Signal that reload is needed
      }
    }
    
    return false;
  } catch (error) {
    console.error('Force version check failed:', error);
    return false;
  }
};

export const updateStoredVersion = (version, timestamp) => {
  localStorage.setItem('app_version', version);
  localStorage.setItem('app_timestamp', timestamp.toString());
};

export const forceReload = async () => {
  // Gentle cache clearing that preserves routing
  
  // 1. Clear browser caches
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    } catch (error) {
      console.error('Cache clearing failed:', error);
    }
  }
  
  // 2. Clear service worker cache if exists
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    } catch (error) {
      console.error('Service worker clearing failed:', error);
    }
  }
  
  // 3. Preserve auth state but clear version info
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const appVersion = localStorage.getItem('app_version');
  const appTimestamp = localStorage.getItem('app_timestamp');
  
  // Only clear version data, keep auth
  localStorage.removeItem('app_version');
  localStorage.removeItem('app_timestamp');
  
  // 4. Simple reload without breaking routing - let React Router handle navigation
  window.location.reload();
};
