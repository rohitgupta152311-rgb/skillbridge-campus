import crypto from 'crypto';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export class UploadService {
  /**
   * Uploads an image to Cloudinary if credentials exist, or provides an optimized safe data URL
   */
  static async uploadImage(
    fileDataUri: string,
    folder: 'avatars' | 'covers' | 'posts' | 'projects' = 'posts'
  ): Promise<UploadResult> {
    // Validate DataURI
    const matches = fileDataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid image format. Expected base64 data URI.');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate allowed image types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error(`Unsupported image type (${mimeType}). Allowed: JPEG, PNG, WebP, GIF.`);
    }

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (buffer.length > maxSizeBytes) {
      throw new Error('Image size exceeds 5MB limit.');
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Production Cloudinary Upload
      const timestamp = Math.floor(Date.now() / 1000);
      const signaturePayload = `folder=studybridge/${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

      const formData = new URLSearchParams();
      formData.append('file', fileDataUri);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', `studybridge/${folder}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary upload failed: ${err}`);
      }

      const json = (await res.json()) as any;
      return {
        url: json.secure_url,
        publicId: json.public_id,
        format: json.format,
        bytes: json.bytes,
        width: json.width,
        height: json.height,
      };
    }

    // Fallback: Safe storage or local simulation
    const fileHash = crypto.createHash('md5').update(buffer).digest('hex');
    const extension = mimeType.split('/')[1];

    return {
      url: fileDataUri, // Preserved directly or serveable
      publicId: `local_${folder}_${fileHash}`,
      format: extension,
      bytes: buffer.length,
    };
  }
}
