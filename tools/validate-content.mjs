import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const postsDir = path.join(root, 'source', '_posts');
const manifestsDir = path.join(root, 'illustrations');
const errors = [];
const warnings = [];
const postRecords = [];

const selected = new Set([
  '2023-summary-and-2024-resolutions.md',
  '2024-summary-and-2025-resolutions.md',
  '2025-summary-and-2026-resolutions.md',
  'Antifragile-Things-That-Gain-from-Disorder.md',
  'The-Bitcoin-Standard.md',
  'investment.md',
  'The-World-I-see.md',
  'Why-Nations-fail.md',
  'Business-cycles-history-theory-and-investment-reality.md',
  'Little-history-of-world.md',
  'Find-a-Europe-SDE-job-from-China.md',
  'recommender-systems-of-popular-apps.md',
  'Tencent-WeChat-backend-intern-interview.md',
  'Windows-Dev-Improvement.md',
  'my-3-years-master.md',
  'my-4-years-college.md',
  'Europe-bank-accounts.md',
  'Ireland-Driving-License.md'
]);

const selectedPresent = new Set([...selected].filter(name => fs.existsSync(path.join(postsDir, name))));

function report(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, extension);
    return entry.name.toLowerCase().endsWith(extension) ? [full] : [];
  });
}

function splitPost(file) {
  const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    report(file, 'missing or malformed YAML front matter');
    return null;
  }
  try {
    return { source, data: yaml.load(match[1]) ?? {}, body: match[2] };
  } catch (error) {
    report(file, `invalid YAML front matter (${error.message})`);
    return null;
  }
}

function dateParts(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return [value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate()];
  }
  const match = String(value ?? '').match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  return match ? match.slice(1, 4).map(Number) : null;
}

function ownUrls(name, value) {
  const date = dateParts(value);
  if (!date) return null;
  const [year, month, day] = date;
  const datePath = [year, month, day].map((part, index) => index ? String(part).padStart(2, '0') : part).join('/');
  const slug = path.basename(name, '.md');
  return {
    zh: `https://youngforest.github.io/${datePath}/${slug}/`,
    en: `https://youngforest.github.io/en/${datePath}/${slug}/`
  };
}

function hasBodyH1(body) {
  let inFence = false;
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    else if (!inFence && /^#\s+/.test(line)) return true;
  }
  return false;
}

const config = yaml.load(fs.readFileSync(path.join(root, '_config.yml'), 'utf8')) ?? {};
const isEnglish = String(config.root ?? '/').startsWith('/en');
const maxDescription = isEnglish ? 155 : 80;

for (const file of listFiles(postsDir, '.md')) {
  const parsed = splitPost(file);
  if (!parsed) continue;
  const name = path.basename(file);
  const { data, body } = parsed;
  if (!data.title) report(file, 'front matter requires title');
  if (!dateParts(data.date)) report(file, 'front matter requires a parseable date');

  if (data.description) {
    const length = [...String(data.description).trim()].length;
    if (length > maxDescription) {
      report(file, `description is ${length} characters; limit is ${maxDescription}`);
    }
  } else if (selectedPresent.has(name)) {
    report(file, 'selected article requires description');
  }

  if (selectedPresent.has(name) && hasBodyH1(body)) {
    report(file, 'selected article body headings must start at H2');
  }

  if (data.translations !== undefined) {
    const expected = ownUrls(name, data.date);
    const translations = data.translations;
    if (!translations || typeof translations !== 'object') {
      report(file, 'translations must be a mapping');
    } else if (!expected || translations['zh-CN'] !== expected.zh || translations.en !== expected.en) {
      report(file, 'translations must contain the exact dated zh-CN and en URLs');
    }
  }

  for (const match of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const [, alt, src] = match;
    if (src.includes('/images/ai/') && !alt.trim()) report(file, `AI image ${src} has empty alt text`);
  }

  postRecords.push({ file, name, body, data, timestamp: Date.UTC(...(dateParts(data.date) ?? [0, 1, 1]).map((part, index) => index === 1 ? part - 1 : part)) });
}

for (const post of [...postRecords].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)) {
  if (!post.body.includes('<!-- more -->')) {
    report(post.file, 'one of the ten newest posts requires an explicit <!-- more --> marker');
    continue;
  }
  const excerpt = post.body.split('<!-- more -->', 1)[0];
  const imageCount = [...excerpt.matchAll(/!\[[^\]]*\]\([^)]+\)|<img\b/gi)].length;
  if (imageCount > 1) report(post.file, `homepage excerpt contains ${imageCount} images; limit is 1`);
}

function webpDimensions(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X' && data + 10 <= buffer.length) {
      return { width: buffer.readUIntLE(data + 4, 3) + 1, height: buffer.readUIntLE(data + 7, 3) + 1 };
    }
    if (type === 'VP8 ' && data + 10 <= buffer.length) {
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }
    if (type === 'VP8L' && data + 5 <= buffer.length && buffer[data] === 0x2f) {
      const b1 = buffer[data + 1];
      const b2 = buffer[data + 2];
      const b3 = buffer[data + 3];
      const b4 = buffer[data + 4];
      return {
        width: 1 + (((b2 & 0x3f) << 8) | b1),
        height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
      };
    }
    offset = data + size + (size % 2);
  }
  return null;
}

for (const file of listFiles(path.join(root, 'source', 'images', 'ai'), '.webp')) {
  const size = fs.statSync(file).size;
  if (size > 250000) report(file, `image is ${size} bytes; hard limit is 250000`);
  else if (size > 200000) warnings.push(`${path.relative(root, file)}: ${size} bytes exceeds the 200000-byte target`);
  const dimensions = webpDimensions(file);
  if (!dimensions) report(file, 'cannot read WebP dimensions');
  else if (dimensions.width !== 1536 || dimensions.height !== 864) {
    report(file, `image is ${dimensions.width}x${dimensions.height}; required size is 1536x864`);
  }
}

const approvedAssets = new Map();
for (const file of listFiles(manifestsDir, '.yml')) {
  let manifest;
  try {
    manifest = yaml.load(fs.readFileSync(file, 'utf8')) ?? {};
  } catch (error) {
    report(file, `invalid YAML (${error.message})`);
    continue;
  }
  if (manifest.version !== 'editorial-comic-v1') report(file, 'version must be editorial-comic-v1');
  const post = path.resolve(root, String(manifest.post ?? ''));
  if (!manifest.post || !fs.existsSync(post)) report(file, 'post must reference an existing Markdown file');
  if (!String(manifest.context ?? '').trim()) report(file, 'context is required');
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    report(file, 'assets must be a non-empty list');
    continue;
  }
  for (const asset of manifest.assets) {
    for (const key of ['id', 'file', 'placement', 'alt', 'composition', 'review_status']) {
      if (!String(asset?.[key] ?? '').trim()) report(file, `asset requires ${key}`);
    }
    if (!['candidate', 'approved', 'rejected'].includes(asset.review_status)) {
      report(file, `invalid review_status ${asset.review_status}`);
    }
    if (asset.review_status === 'approved') {
      const assetPath = path.resolve(root, asset.file);
      if (!fs.existsSync(assetPath)) report(file, `approved asset is missing: ${asset.file}`);
      approvedAssets.set(asset.file.replaceAll('\\', '/'), { file, asset });
    }
  }
}

for (const post of postRecords) {
  for (const match of post.body.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi)) {
    const figureAttrs = match[1];
    const img = match[2].match(/<img\b([^>]*)>/i);
    if (!/class=["'][^"']*\beditorial-illustration\b/.test(figureAttrs)) continue;
    if (!img) {
      report(post.file, 'editorial figure requires an img element');
      continue;
    }
    const attrs = Object.fromEntries([...img[1].matchAll(/([\w-]+)=["']([^"']*)["']/g)].map(item => [item[1], item[2]]));
    for (const key of ['src', 'alt', 'width', 'height', 'decoding']) {
      if (!String(attrs[key] ?? '').trim()) report(post.file, `editorial image requires ${key}`);
    }
    if (attrs.width !== '1536' || attrs.height !== '864') report(post.file, 'editorial image dimensions must be 1536x864');
    if (attrs.decoding !== 'async') report(post.file, 'editorial image decoding must be async');
    const isHero = /class=["'][^"']*\beditorial-illustration--hero\b/.test(figureAttrs);
    if (!isHero && attrs.loading !== 'lazy') report(post.file, 'inline editorial image must use loading=lazy');
    if (isHero && attrs.loading === 'lazy') report(post.file, 'hero editorial image must not be lazy loaded');
    const local = String(attrs.src ?? '').replace(/^\/en\//, '/').replace(/^\//, 'source/');
    const manifestPath = [...approvedAssets.keys()].find(item => item.endsWith(local));
    if (!manifestPath) report(post.file, `editorial image is not approved in a manifest: ${attrs.src}`);
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`\nContent validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Content validation passed: ${postRecords.length} posts, ${approvedAssets.size} approved editorial assets, ${warnings.length} warning(s).`);
