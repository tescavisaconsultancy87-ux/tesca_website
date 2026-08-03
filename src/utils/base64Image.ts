/**
 * Utility functions for Base64 image conversion, validation, and user-side rendering.
 */

const IMAGE_MAGIC_BYTES: Record<string, { magic: number[]; mime: string }> = {
  jpeg: { magic: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg' },
  png: { magic: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mime: 'image/png' },
  webp: { magic: [0x52, 0x49, 0x46, 0x46], mime: 'image/webp' },
  gif: { magic: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif' },
};

/**
 * Detects image file extension and MIME type from array buffer magic bytes.
 */
export const detectImageType = (buffer: ArrayBuffer): string | null => {
  const bytes = new Uint8Array(buffer);
  for (const [ext, sig] of Object.entries(IMAGE_MAGIC_BYTES)) {
    if (sig.magic.every((b, i) => bytes[i] === b)) {
      return ext;
    }
  }
  return null;
};

/**
 * Converts an uploaded File object directly into a Base64 Data URL string (data:image/...;base64,...).
 */
export const convertFileToBase64 = async (photoFile: File): Promise<string> => {
  const buffer = await photoFile.arrayBuffer();
  const detectedExt = detectImageType(buffer);

  let mime = photoFile.type;
  if (detectedExt && IMAGE_MAGIC_BYTES[detectedExt]) {
    mime = IMAGE_MAGIC_BYTES[detectedExt].mime;
  } else if (!mime || !mime.startsWith('image/')) {
    mime = 'image/jpeg';
  }

  const base64String = Buffer.from(buffer).toString('base64');
  return `data:${mime};base64,${base64String}`;
};

/**
 * Normalizes an image source for client-side rendering.
 * If already a data URI or external URL, returns as-is.
 * If raw base64 string without header, prepends data URI prefix.
 */
export const ensureImageSrc = (imgSrc: string | null | undefined, fallback: string = ''): string => {
  if (!imgSrc) return fallback;
  const trimmed = imgSrc.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `data:image/jpeg;base64,${trimmed}`;
};
