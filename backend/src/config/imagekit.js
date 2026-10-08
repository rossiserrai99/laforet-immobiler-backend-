require('dotenv').config();
const ImageKit = require('imagekit');

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || 'public_placeholder';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_placeholder';
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/placeholder';

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.warn('⚠️ Warning: ImageKit credentials missing in environment variables.');
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint
});

/**
 * Upload a file buffer or stream to ImageKit
 * @param {Buffer|string} file - File buffer, base64 string, or remote URL
 * @param {string} fileName - Destination file name
 * @param {string} folder - Destination folder on ImageKit (e.g. '/laforet_properties')
 * @returns {Promise<Object>} ImageKit upload response { fileId, url, name, ... }
 */
const uploadToImageKit = async (file, fileName, folder = '/laforet_properties') => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file,
        fileName,
        folder,
        useUniqueFileName: true
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

/**
 * Delete a file by fileId from ImageKit
 * @param {string} fileId
 * @returns {Promise<Object>}
 */
const deleteFromImageKit = async (fileId) => {
  return new Promise((resolve, reject) => {
    imagekit.deleteFile(fileId, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/**
 * Get client authentication parameters for secure direct client uploads
 * @returns {Object} { token, expire, signature }
 */
const getAuthenticationParameters = () => {
  return imagekit.getAuthenticationParameters();
};

module.exports = {
  imagekit,
  uploadToImageKit,
  deleteFromImageKit,
  getAuthenticationParameters
};
