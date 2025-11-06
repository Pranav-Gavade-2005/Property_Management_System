import fs from 'fs';
import path from 'path';

export async function uploadPropertyImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Generate file URLs
    const imageUrls = req.files.map(file => {
      return `/uploads/properties/${file.filename}`;
    });

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
}

export async function deletePropertyImage(req, res) {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads/properties', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}
