import fs from 'fs/promises';
import path from 'path';

const srcDir = './src';

async function updateTheme(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await updateTheme(fullPath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.css') || file.name === 'tailwind.config.js') {
      let content = await fs.readFile(fullPath, 'utf8');
      
      // Theme text colors
      content = content.replace(/text-white/g, 'text-gray-900');
      content = content.replace(/text-industrial-400/g, 'text-gray-600');
      content = content.replace(/text-industrial-500/g, 'text-gray-500');
      
      // Theme backgrounds
      content = content.replace(/bg-industrial-900/g, 'bg-gray-50');
      content = content.replace(/bg-industrial-800/g, 'bg-white');
      content = content.replace(/bg-industrial-700/g, 'bg-gray-100');
      content = content.replace(/bg-industrial-600/g, 'bg-gray-200');
      
      // Theme borders
      content = content.replace(/border-white\/5/g, 'border-gray-200');
      content = content.replace(/border-white\/10/g, 'border-gray-200');
      content = content.replace(/border-white\/20/g, 'border-gray-300');
      
      // Fix specific CSS and Leaflet popup colors in index.css
      if (fullPath.includes('index.css')) {
        content = content.replace(/bg-glass-gradient/g, 'bg-white');
        content = content.replace(/border border-white\/10/g, 'border border-gray-200');
        content = content.replace(/rgba\(255,255,255,0\.5\)/g, 'rgba(0,0,0,0.1)'); // shadow adjustments
        content = content.replace(/background: #0a0e17 !important;/g, 'background: #f9fafb !important;');
        content = content.replace(/background: #111827 !important;/g, 'background: #ffffff !important;');
        content = content.replace(/color: #f3f4f6 !important;/g, 'color: #111827 !important;');
        content = content.replace(/border: 1px solid rgba\(255,255,255,0\.1\);/g, 'border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1);');
        content = content.replace(/::-webkit-scrollbar-track {\s*background: #0a0e17;\s*}/g, '::-webkit-scrollbar-track {\n  background: #f9fafb;\n}');
        content = content.replace(/::-webkit-scrollbar-thumb {\s*background: #1f2937;\s*border-radius: 4px;\s*}/g, '::-webkit-scrollbar-thumb {\n  background: #d1d5db;\n  border-radius: 4px;\n}');
        content = content.replace(/::-webkit-scrollbar-thumb:hover {\s*background: #374151;\s*}/g, '::-webkit-scrollbar-thumb:hover {\n  background: #9ca3af;\n}');
      }

      // Map Layer Replacement
      if (fullPath.includes('LiveMap.jsx')) {
        content = content.replace(/https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png/g, 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        // also replace circle fill color to be visible on light map
        content = content.replace(/fillOpacity: 0\.2/g, 'fillOpacity: 0.4');
      }

      // Chart.js font colors in Analytics.jsx
      if (fullPath.includes('Analytics.jsx')) {
        content = content.replace(/color: '#9ca3af'/g, "color: '#4b5563'"); // axis labels
        content = content.replace(/backgroundColor: 'rgba\(17, 24, 39, 0\.9\)'/g, "backgroundColor: 'rgba(255, 255, 255, 0.9)'");
        content = content.replace(/titleColor: '#f3f4f6'/g, "titleColor: '#111827'");
        content = content.replace(/bodyColor: '#9ca3af'/g, "bodyColor: '#4b5563'");
        content = content.replace(/borderColor: 'rgba\(255,255,255,0\.1\)'/g, "borderColor: '#e5e7eb'");
        content = content.replace(/color: 'rgba\(255,255,255,0\.05\)'/g, "color: '#e5e7eb'"); // grid lines
      }
      
      // Digital Twin specific adjustments for light mode
      if (fullPath.includes('DigitalTwin.jsx')) {
        content = content.replace(/rgba\(255,255,255,0\.3\)/g, 'rgba(0,0,0,0.1)'); // animated gas flow dots
        content = content.replace(/border-white\/50/g, 'border-gray-300'); // node circle border
        content = content.replace(/border-white\/20/g, 'border-gray-300'); // pipe border
      }

      await fs.writeFile(fullPath, content, 'utf8');
    }
  }
}

updateTheme(srcDir)
  .then(() => console.log('Theme successfully updated to light mode!'))
  .catch(err => console.error(err));
