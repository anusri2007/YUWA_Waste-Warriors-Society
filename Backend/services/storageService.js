const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Pluggable cloud/local storage abstraction
class StorageService {
  constructor() {
    this.useCloudinary = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    this.uploadsDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Upload a file buffer and return public URL and metadata
   * @param {Buffer} buffer - File buffer
   * @param {string} originalname - Original filename
   * @param {string} mimetype - MIME type
   * @returns {Promise<{ url: string, publicId: string, size: number }>}
   */
  async uploadFile(buffer, originalname, mimetype) {
    if (!buffer) {
      throw new Error("No file buffer provided for upload");
    }

    // If Cloudinary configured, we can upload using data URI or https request
    if (this.useCloudinary) {
      try {
        const cloudinary = require("cloudinary").v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });

        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "yuwa_ecolympics" },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes
              });
            }
          );
          uploadStream.end(buffer);
        });
      } catch (err) {
        console.warn("Cloudinary upload failed, falling back to local storage:", err.message);
      }
    }

    // Default: Local disk storage served via Express static files
    const ext = path.extname(originalname) || ".bin";
    const randomName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadsDir, randomName);

    await fs.promises.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${randomName}`;
    return {
      url: relativeUrl,
      publicId: randomName,
      size: buffer.length
    };
  }

  /**
   * Delete a file
   * @param {string} fileUrlOrPublicId
   */
  async deleteFile(fileUrlOrPublicId) {
    if (!fileUrlOrPublicId) return;

    try {
      const fileName = path.basename(fileUrlOrPublicId);
      const filePath = path.join(this.uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.error("StorageService: Error deleting file:", err.message);
    }
  }
}

module.exports = new StorageService();
