const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, 'public', 'favicon-g.svg');
const publicDir = path.join(__dirname, 'public');

async function generateFavicons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate favicon.ico (32x32)
    await sharp(svgBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✓ Generated favicon.png (32x32)');

    // Generate logo192.png (192x192)
    await sharp(svgBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo192.png'));
    console.log('✓ Generated logo192.png (192x192)');

    // Generate logo512.png (512x512)
    await sharp(svgBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo512.png'));
    console.log('✓ Generated logo512.png (512x512)');

    console.log('\n✓ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
