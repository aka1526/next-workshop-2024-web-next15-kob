import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import mime from 'mime-types';
// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse multipart form data
const parseMultipartForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable();

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseMultipartForm(req);
     // console.log('Fields:', fields); // form fields
      // console.log('Files:', files);   // uploaded files
      const payload = {
         files : files.myFile ,
    }
   

    // ส่งคำขอไปยัง API จริง
    // Check if file exists
    if (!files.myFile) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
  // Use the first uploaded file
    const uploadedFile = files.myFile[0];
    const { filepath, mimetype  } = uploadedFile;

    // Determine the file extension
    let filePathWithExt = filepath;
    if(mimetype){
        const ext = mime.extension(mimetype);
        if (ext && !filepath.endsWith(`.${ext}`)) {
            // Rename the file if it doesn't have an extension
            filePathWithExt = `${filepath}.${ext}`;
            fs.renameSync(filepath, filePathWithExt); // Rename the file
        }
    }

    // Prepare FormData for the axios request
    const formData = new FormData();
    formData.append('myFile', fs.createReadStream(filePathWithExt));

      // Send request to the actual API
      const response = await axios.post(`${process.env.API_SERVER_URL}/api/food/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error parsing form data', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
