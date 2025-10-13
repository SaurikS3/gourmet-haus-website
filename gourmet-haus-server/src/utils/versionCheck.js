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

export const forceReload = () => {
  // Clear all caches and reload
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  // Clear service worker cache if exists
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  // Hard reload with cache clear
  window.location.reload(true);
};
