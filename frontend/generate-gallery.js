const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/assets/gallery');
const outputFile = path.join(__dirname, 'src/assets/gallery.json');

function generateGallery() {
  if (!fs.existsSync(baseDir)) {
    console.error('❌ Gallery folder not found:', baseDir);
    process.exit(1);
  }

  const categories = fs.readdirSync(baseDir).filter(cat =>
    fs.statSync(path.join(baseDir, cat)).isDirectory()
  );

  const data = {};

  categories.forEach(category => {
    const files = fs.readdirSync(path.join(baseDir, category))
      .filter(f => /\.(png|jpe?g|gif|webp)$/i.test(f)); // images only
    data[category] = files.map(file => `assets/gallery/${category}/${file}`);
  });

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log('✅ gallery.json generated at', outputFile);
}

generateGallery();
