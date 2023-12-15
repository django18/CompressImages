const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Function to compress JPEG images in a folder
async function compressImages(folderPath) {
  try {
    const compressedFolderName = "compressed";

    // Check if the compressed folder exists
    const compressedFolderPath = path.join(folderPath, compressedFolderName);
    if (fs.existsSync(compressedFolderPath)) {
      // If it exists, delete it
      fs.rmdirSync(compressedFolderPath, { recursive: true });
      console.log("Existing compressed folder deleted.");
    }

    // Create the compressed folder
    fs.mkdirSync(compressedFolderPath);

    // Read all JPEG files in the folder
    const jpegImages = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".jpeg") || file.endsWith(".jpg"));

    // Compress each image and save in the 'compressed' folder
    for (const image of jpegImages) {
      const inputImagePath = path.join(folderPath, image);
      const outputImagePath = path.join(compressedFolderPath, image);

      // Compress image if it exceeds 15 MB
      // const inputImageSize = fs.statSync(inputImagePath).size;

      await sharp(inputImagePath)
        .jpeg({ quality: 20 }) // Adjust quality as needed
        .toFile(outputImagePath);

      console.log(`Image '${image}' compressed and saved.`);
    }

    console.log(`Compression completed for folder: ${folderPath}`);
  } catch (error) {
    console.error("Error during compression:", error);
  }
}

// Specify the path of the main folder containing subfolders with images
const mainFolderPath = "/path/to/main/folder";

console.log("Running the Compression Script");

try {
  // Call the function to compress images in each subfolder
  fs.readdirSync(mainFolderPath).forEach((folder) => {
    const folderPath = path.join(mainFolderPath, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      compressImages(folderPath);
    }
  });
} catch (error) {
  console.error({ error });
}
