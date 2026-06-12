import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; // Humari purani cloudinary file

// Cloudinary Storage ka setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hosteljugaad_pyqs', // Cloudinary mein is naam ka folder ban jayega
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Sirf yeh files allow hongi
  },
});

// Multer ko storage pass karna
const upload = multer({ storage: storage });

export default upload;