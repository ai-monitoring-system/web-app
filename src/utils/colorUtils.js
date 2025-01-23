export const adjustColor = (color, amount, isDarkMode = false) => {
  const clamp = (num) => Math.min(Math.max(num, 0), 255);
  
  // Remove the hash if present
  color = color.replace('#', '');
  
  // Parse the color
  const num = parseInt(color, 16);
  let r = (num >> 16);
  let g = ((num >> 8) & 0x00FF);
  let b = (num & 0x0000FF);
  
  // Adjust for dark mode
  if (isDarkMode) {
    // Make colors significantly darker in dark mode
    r = clamp(r - Math.abs(amount) * 1.2);
    g = clamp(g - Math.abs(amount) * 1.2);
    b = clamp(b - Math.abs(amount) * 1.2);
    
    // Maintain color saturation but reduce brightness
    const max = Math.max(r, g, b);
    if (max > 0) {
      const factor = Math.min(1, 180 / max); // Cap brightness
      r = Math.round(r * factor);
      g = Math.round(g * factor);
      b = Math.round(b * factor);
    }
  } else {
    // Regular light mode adjustment
    r = clamp(r + amount);
    g = clamp(g + amount);
    b = clamp(b + amount);
  }
  
  // Convert back to hex
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}; 