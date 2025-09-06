// Utility functions for safe date formatting
export const formatDate = (dateInput: any): string => {
  if (!dateInput) return "Not available";
  
  try {
    // Handle BigInt timestamp (convert to number first)
    if (typeof dateInput === 'bigint') {
      dateInput = Number(dateInput);
    }
    
    // Handle number timestamp
    if (typeof dateInput === 'number') {
      // If it's a very large number, it might be in microseconds or nanoseconds
      if (dateInput > 1e12) {
        dateInput = Math.floor(dateInput / 1000); // Convert to milliseconds
      }
      dateInput = new Date(dateInput);
    }
    
    // Handle string dates
    if (typeof dateInput === 'string') {
      dateInput = new Date(dateInput);
    }
    
    // Handle Date objects
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      return dateInput.toLocaleDateString();
    }
    
    return "Invalid date";
  } catch (error) {
    console.warn('Date formatting error:', error, 'Input:', dateInput);
    return "Invalid date";
  }
};

export const formatDateTime = (dateInput: any): string => {
  if (!dateInput) return "Never";
  
  try {
    // Handle BigInt timestamp (convert to number first)
    if (typeof dateInput === 'bigint') {
      dateInput = Number(dateInput);
    }
    
    // Handle number timestamp
    if (typeof dateInput === 'number') {
      // If it's a very large number, it might be in microseconds or nanoseconds
      if (dateInput > 1e12) {
        dateInput = Math.floor(dateInput / 1000); // Convert to milliseconds
      }
      dateInput = new Date(dateInput);
    }
    
    // Handle string dates
    if (typeof dateInput === 'string') {
      dateInput = new Date(dateInput);
    }
    
    // Handle Date objects
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      return dateInput.toLocaleString();
    }
    
    return "Never";
  } catch (error) {
    console.warn('DateTime formatting error:', error, 'Input:', dateInput);
    return "Never";
  }
};

export const formatRelativeTime = (dateInput: any): string => {
  if (!dateInput) return "Never";
  
  try {
    // Handle BigInt timestamp (convert to number first)
    if (typeof dateInput === 'bigint') {
      dateInput = Number(dateInput);
    }
    
    // Handle number timestamp
    if (typeof dateInput === 'number') {
      // If it's a very large number, it might be in microseconds or nanoseconds
      if (dateInput > 1e12) {
        dateInput = Math.floor(dateInput / 1000); // Convert to milliseconds
      }
      dateInput = new Date(dateInput);
    }
    
    // Handle string dates
    if (typeof dateInput === 'string') {
      dateInput = new Date(dateInput);
    }
    
    // Handle Date objects
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      const now = new Date();
      const diffMs = now.getTime() - dateInput.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return dateInput.toLocaleDateString();
    }
    
    return "Never";
  } catch (error) {
    console.warn('Relative time formatting error:', error, 'Input:', dateInput);
    return "Never";
  }
};
