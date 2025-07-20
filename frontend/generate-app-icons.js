const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Apple Icon Grid Guidelines compliance
// Based on: https://developer.apple.com/design/human-interface-guidelines/app-icons
// Layout size: 1024x1024px
// Grid unit: 32px (1024/32 = 32 grid units)
// Recommended content area: 80% of total area (approx 26 grid units)
// Safe margin: 10% on each side (3.2 grid units ≈ 3 units)

function createLargeChefHatSVG(size) {
  // Calculate proportions for 1024x1024 grid
  const gridUnit = size / 32; // 32px at 1024px size
  const contentSize = gridUnit * 26; // 80% content area
  const margin = (size - contentSize) / 2; // Center the content
  
  // Scale the original 16x16 ChefHatIcon to fill the content area
  const iconScale = contentSize / 16; // Scale factor from 16px to content size
  const iconX = margin;
  const iconY = margin;
  
  // Calculate stroke width relative to size (proportional to original 1.5px)
  const strokeWidth = (1.5 * iconScale) / 16; // Scale the original 1.5px stroke
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Food-accent orange background gradient -->
    <radialGradient id="backgroundGradient_${size}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#FFB366"/>
      <stop offset="50%" style="stop-color:#FF8500"/>
      <stop offset="100%" style="stop-color:#E6610A"/>
    </radialGradient>
    
    <!-- Shadow filter for Liquid Glass effect -->
    <filter id="dropShadow_${size}">
      <feDropShadow dx="${size * 0.004}" dy="${size * 0.008}" stdDeviation="${size * 0.006}" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Food-accent orange background -->
  <rect width="${size}" height="${size}" fill="url(#backgroundGradient_${size})"/>
  
  <!-- Original ChefHatIcon scaled up -->
  <g transform="translate(${iconX}, ${iconY}) scale(${iconScale})">
    <path
      d="M4 11H12V13C12 13.55 11.55 14 11 14H5C4.45 14 4 13.55 4 13V11Z"
      stroke="white"
      strokeWidth="${strokeWidth}"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
      filter="url(#dropShadow_${size})"
    />
    <path
      d="M8 11V12.5M8 2C6.5 2 5.5 3 5.5 4.5C4 4.5 3 5.5 3 7C3 8.5 4 9.5 5.5 9.5H10.5C12 9.5 13 8.5 13 7C13 5.5 12 4.5 10.5 4.5C10.5 3 9.5 2 8 2Z"
      stroke="white"
      strokeWidth="${strokeWidth}"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
      filter="url(#dropShadow_${size})"
    />
  </g>
</svg>`.trim();
}

// Icon sizes required for iOS PWA apps
const iconSizes = [
  { size: 57, filename: 'icon-57x57.png' },
  { size: 60, filename: 'icon-60x60.png' },
  { size: 72, filename: 'icon-72x72.png' },
  { size: 76, filename: 'icon-76x76.png' },
  { size: 114, filename: 'icon-114x114.png' },
  { size: 120, filename: 'icon-120x120.png' },
  { size: 144, filename: 'icon-144x144.png' },
  { size: 152, filename: 'icon-152x152.png' },
  { size: 180, filename: 'icon-180x180.png' },
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' },
  { size: 180, filename: 'apple-touch-icon.png' }
];

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('🍳 Generating Liquid Glass ChefHat icons following Apple guidelines...');
  console.log('📏 Grid compliance: 32-unit grid system, 80% content area');
  
  for (const { size, filename } of iconSizes) {
    try {
      const svgContent = createLargeChefHatSVG(size);
      const outputPath = path.join(publicDir, filename);
      
      await sharp(Buffer.from(svgContent))
        .png({
          quality: 100,
          compressionLevel: 6,
          progressive: true
        })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`✅ Generated ${filename} (${size}x${size}px, ${(stats.size / 1024).toFixed(1)}KB)`);
    } catch (error) {
      console.error(`❌ Failed to generate ${filename}:`, error.message);
    }
  }
  
  console.log('🎉 Icon generation complete! All icons follow Apple Liquid Glass guidelines.');
  console.log('📐 Icons now use proper grid proportions with 80% content area coverage.');
}

if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = { generateIcons, createLargeChefHatSVG };