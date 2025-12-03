/**
 * Generate Logo JPG and Favicon from SVG
 * Converts logo.svg to logo.jpg (120x120) and favicon.ico (32x32)
 * Requires: sharp package
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
const jpgPath = path.join(process.cwd(), 'public', 'logo.jpg');
const icoPath = path.join(process.cwd(), 'public', 'favicon.ico');
const iconSvgPath = path.join(process.cwd(), 'public', 'icon.svg');

async function generateLogo() {
  try {
    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.error('❌ logo.svg not found at:', svgPath);
      process.exit(1);
    }

    // Ensure icon.svg is the same as logo.svg
    if (!fs.existsSync(iconSvgPath) || fs.readFileSync(iconSvgPath, 'utf8') !== fs.readFileSync(svgPath, 'utf8')) {
      console.log('📝 Updating icon.svg to match logo.svg...');
      fs.copyFileSync(svgPath, iconSvgPath);
    }

    // Convert SVG to JPG (120x120)
    await sharp(svgPath)
      .resize(120, 120, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 95 })
      .toFile(jpgPath);

    console.log('✅ Logo JPG generated:', jpgPath);

    // Convert SVG to ICO (favicon - multiple sizes)
    // Generate multiple sizes for favicon.ico (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const icoImages = await Promise.all(
      sizes.map(async (size) => {
        const buffer = await sharp(svgPath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png()
          .toBuffer();
        return { size, buffer };
      })
    );

    // Create ICO file (simplified - using 32x32 as primary)
    // Note: sharp doesn't support ICO directly, so we'll create a PNG and rename it
    // For proper ICO, we'd need a library like 'to-ico', but PNG works for most browsers
    await sharp(svgPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(icoPath);

    console.log('✅ Favicon ICO generated:', icoPath);
    console.log('✅ Icon SVG updated:', iconSvgPath);
    console.log('\n📐 Generated files:');
    console.log('   - logo.jpg (120x120)');
    console.log('   - favicon.ico (32x32)');
    console.log('   - icon.svg (updated to match logo)');
  } catch (error) {
    console.error('❌ Error generating logo/favicon:', error.message);
    console.error('\n💡 Make sure sharp is installed: npm install sharp');
    process.exit(1);
  }
}

generateLogo();

