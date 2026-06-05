import imageCompression from 'browser-image-compression';

/**
 * Comprime un file immagine o un Blob.
 * @param {File|Blob} imageFile L'immagine da comprimere
 * @param {number} maxSizeMB Dimensione massima desiderata in MB
 * @param {number} maxWidthOrHeight Risoluzione massima (larghezza o altezza)
 * @returns {Promise<File|Blob>} L'immagine compressa
 */
export const compressImage = async (imageFile, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`Immagine compressa: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error("Errore durante la compressione dell'immagine:", error);
    // Se fallisce, ritorna l'immagine originale per non bloccare l'upload
    return imageFile;
  }
};
