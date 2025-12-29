import { CompareResponse, UploadResponse, RoomImages } from '../types';

const API_BASE_URL = 'https://hackathon-2025-39q9.onrender.com';

/**
 * Convert base64 data URL to Blob for file upload
 */
const dataURLtoBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Upload a single image to the backend
 * Returns the file name from Gemini File API
 */
export const uploadImage = async (imageBase64: string): Promise<string> => {
  const blob = dataURLtoBlob(imageBase64);
  const formData = new FormData();
  formData.append('image', blob, 'photo.jpg');

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data: UploadResponse = await response.json();
  return data.fileName;
};

/**
 * Compare all room images using the backend API
 */
export const compareRooms = async (filenames: {
  kitchenFilename: string;
  bathroomFilename: string;
  livingRoomFilename: string;
  bedroomFilename: string;
}): Promise<CompareResponse> => {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filenames),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to compare images');
  }

  return response.json();
};

/**
 * Upload all room images and then compare them
 * This is the main function to call from the UI
 */
export const analyzeAllRooms = async (
  roomImages: RoomImages
): Promise<CompareResponse> => {
  // Validate all images are present
  if (!roomImages.kitchen || !roomImages.bathroom || !roomImages.livingRoom || !roomImages.bedroom) {
    throw new Error('All four room images are required');
  }

  // Upload all images in parallel
  const [kitchenFilename, bathroomFilename, livingRoomFilename, bedroomFilename] = await Promise.all([
    uploadImage(roomImages.kitchen),
    uploadImage(roomImages.bathroom),
    uploadImage(roomImages.livingRoom),
    uploadImage(roomImages.bedroom),
  ]);

  // Compare all rooms
  const result = await compareRooms({
    kitchenFilename,
    bathroomFilename,
    livingRoomFilename,
    bedroomFilename,
  });

  return result;
};
