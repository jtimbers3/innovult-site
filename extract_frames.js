const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const video = process.argv[2];
const outDir = process.argv[3] || 'video_frames';
if (!video) throw new Error('Usage: node extract_frames.js <videoPath> [outDir]');

fs.mkdirSync(outDir, { recursive: true });

ffmpeg(video)
  .outputOptions(['-vf', 'fps=1/20,scale=1366:-1'])
  .output(path.join(outDir, 'frame-%03d.jpg'))
  .on('start', cmd => console.log('FFmpeg:', cmd))
  .on('end', () => console.log('Done'))
  .on('error', err => { console.error(err); process.exit(1); })
  .run();