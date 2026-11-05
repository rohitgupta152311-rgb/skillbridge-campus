import { Request, Response, NextFunction } from 'express';
import { UploadService } from './upload.service.js';
import { AppError } from '../../middleware/error-handler.js';

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { image, folder } = req.body;

    if (!image) {
      throw new AppError('Image payload (base64 Data URI) is required.', 400);
    }

    const result = await UploadService.uploadImage(image, folder);

    return res.json({
      success: true,
      message: 'Image uploaded successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}
