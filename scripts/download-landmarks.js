import fs from 'fs';
import path from 'path';
import https from 'https';

const landmarkDir = path.join(process.cwd(), 'public', 'images', 'landmarks');
if (!fs.existsSync(landmarkDir)) {
  fs.mkdirSync(landmarkDir, { recursive: true });
}

const landmarkUrls = {
  'uk.jpg': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
  'australia.jpg': 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=800',
  'canada.jpg': 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=800',
  'usa.jpg': 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=800',
  'new-zealand.jpg': 'https://images.pexels.com/photos/5342979/pexels-photo-5342979.jpeg?auto=compress&cs=tinysrgb&w=800',
  'ireland.jpg': 'https://images.pexels.com/photos/2563821/pexels-photo-2563821.jpeg?auto=compress&cs=tinysrgb&w=800',
  'germany.jpg': 'https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=800',
  'europe.jpg': 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=800'
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  for (const [filename, url] of Object.entries(landmarkUrls)) {
    const filePath = path.join(landmarkDir, filename);
    console.log(`Downloading landmark: ${filename}...`);
    try {
      await download(url, filePath);
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, e);
    }
  }
}

main();
