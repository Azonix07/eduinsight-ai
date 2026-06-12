import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedImage {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('cloudinary.cloudName');
    const apiKey = this.configService.get<string>('cloudinary.apiKey');
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.logger.log('Cloudinary configured');
    } else {
      this.logger.warn('Cloudinary not configured — uploads will use placeholder URLs (demo mode)');
    }
  }

  get isConfigured(): boolean {
    return this.configured;
  }

  /** Upload an image buffer. In demo mode (no credentials) returns a placeholder URL. */
  async uploadImage(buffer: Buffer, folder = 'eduinsight'): Promise<UploadedImage> {
    if (!this.configured) {
      const id = uuidv4();
      return {
        url: `https://demo.eduinsight.local/${folder}/${id}.jpg`,
        publicId: `${folder}/${id}`,
        format: 'jpg',
        bytes: buffer.length,
      };
    }

    return new Promise<UploadedImage>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error as Error);
            return reject(error ?? new Error('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );
      stream.end(buffer);
    });
  }

  /** Best-effort deletion; silently no-ops in demo mode. */
  async deleteImage(publicId: string): Promise<void> {
    if (!this.configured) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(`Failed to delete image ${publicId}`, error as Error);
    }
  }
}
