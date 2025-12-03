/**
 * Generate Logo JPG from SVG
 * Converts logo.svg to logo.jpg (120x120)
 * Requires: sharp package
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
const jpgPath = path.join(process.cwd(), 'public', 'logo.jpg');

async function generateLogo() {
  try {
    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.error('❌ logo.svg not found at:', svgPath);
      process.exit(1);
    }

    // Convert SVG to JPG
    await sharp(svgPath)
      .resize(120, 120, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 95 })
      .toFile(jpgPath);

    console.log('✅ Logo generated successfully!');
    console.log('📁 Output:', jpgPath);
    console.log('📐 Size: 120x120 pixels');
  } catch (error) {
    console.error('❌ Error generating logo:', error.message);
    console.error('\n💡 Make sure sharp is installed: npm install sharp');
    process.exit(1);
  }
}

generateLogo();

