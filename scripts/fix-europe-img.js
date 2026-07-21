import fs from 'fs';
import path from 'path';
import https from 'https';

const filePath = path.join(process.cwd(), 'public', 'images', 'landmarks', 'europe.jpg');

const url = 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/responsive-images/elva-800w.jpg'; // test fallback or real landmark

// High res Eiffel tower landmark direct URL
const eiffelUrl = 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=800';

const download = (targetUrl, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(targetUrl, response => {
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

download(eiffelUrl, filePath).then(() => {
  console.log('Successfully updated europe.jpg with Eiffel Tower landmark!');
}).catch(err => {
  console.error('Error downloading europe.jpg:', err);
});
