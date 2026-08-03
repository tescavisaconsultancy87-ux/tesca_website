import { supabase } from "./supabase";

const IMAGE_MAGIC_BYTES: Record<string, { magic: number[]; mime: string }> = {
  jpeg: { magic: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg' },
  png: { magic: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mime: 'image/png' },
  webp: { magic: [0x52, 0x49, 0x46, 0x46], mime: 'image/webp' },
  gif: { magic: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif' },
};

/**
 * Detects image format from binary magic bytes for security verification.
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
 * Uploads an image file to Supabase Storage ('tesca-assets' bucket)
 * and returns the public CDN URL.
 */
export const uploadImageToSupabase = async (photoFile: File, folder: string = 'general'): Promise<string> => {
  const buffer = await photoFile.arrayBuffer();

  const detectedExt = detectImageType(buffer);
  if (!detectedExt) {
    throw new Error("Invalid image file. Only JPEG, PNG, WEBP, and GIF formats are accepted.");
  }

  const mime = IMAGE_MAGIC_BYTES[detectedExt].mime;
  const key = `${folder}/${crypto.randomUUID()}.${detectedExt}`;

  const { error } = await supabase.storage
    .from('tesca-assets')
    .upload(key, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (error) {
    console.error("Storage upload failed:", error.message);
    throw new Error(`Failed to upload image to storage: ${error.message}`);
  }

  const { data } = supabase.storage.from('tesca-assets').getPublicUrl(key);
  return data.publicUrl;
};
