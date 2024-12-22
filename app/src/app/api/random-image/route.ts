import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the absolute path to the images directory
    const imagesDirectory = path.join(process.cwd(), 'public', 'images');

    console.log('Looking for images in:', imagesDirectory);

    // Check if directory exists
    if (!fs.existsSync(imagesDirectory)) {
      console.error('Directory not found:', imagesDirectory);
      return NextResponse.json(
        { error: 'Images directory not found' },
        { status: 404 }
      );
    }

    // Read all files from the directory
    const files = fs.readdirSync(imagesDirectory);
    console.log('Found files:', files);

    // Filter for image files
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images found in the directory' },
        { status: 404 }
      );
    }

    // Select a random image
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    console.log('Selected image:', randomImage);

    // Read the image file
    const imagePath = path.join(imagesDirectory, randomImage);
    const imageBuffer = fs.readFileSync(imagePath);

    // Determine the content type based on file extension
    const extension = path.extname(randomImage).toLowerCase();
    const contentType = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    }[extension] || 'application/octet-stream';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random image', details: error.message },
      { status: 500 }
    );
  }
}