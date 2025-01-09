import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


    const uploadToCloudinary = async (filePath) => {
        try {
            if(!filePath) return null;
          const result = await cloudinary.uploader.upload(filePath, {resourse_type : "auto"});
          return result; // Contains details like URL, public_id, etc.
        } catch (error) {
            fs.unlinkSync(filePath)
          console.error("Cloudinary upload error:", error);
          throw error;
        }
      };


      const deleteFromCloudinary = async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          return result; // Contains result: 'ok' or 'not found'.
        } catch (error) {
          console.error("Cloudinary delete error:", error);
          throw error;
        }
      };

export {uploadToCloudinary}      