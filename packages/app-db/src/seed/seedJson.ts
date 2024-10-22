import * as fs from "fs/promises";
import { PlaceService } from "../services/PlaceService";
import { repositoryController } from "../contoller/RepositoryController";
import { Category } from "../models";
import { CategoryService } from "../services/CategoryService";
import { ImageService } from "../services";

interface PlaceData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  category: string;
  short_description: string;
  long_description: string;
  image_url: string;
  lat: string;
  lng: string;
  rating?: string;
  reviews?: string;
}

async function processJsonFile(filePath: string) {
  try {
    // Read the JSON file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const placesData: PlaceData[] = JSON.parse(fileContent);

    // Initialize repositories
    await repositoryController.initializeRepositories();
    const placeService = new PlaceService(repositoryController);
    const categoryService = new CategoryService(repositoryController);
    const imageService = new ImageService(repositoryController);

    console.log("Starting to process the JSON file...");

    for (const row of placesData) {
      const {
        name,
        address,
        city,
        state,
        country,
        website,
        category: categoryStr,
        short_description,
        long_description,
        image_url,
        lat,
        lng,
        rating,
        reviews,
      } = row;

      // Capitalize and split categories
      const categories = categoryStr.split(",").map((category) => {
        const trimmedCategory = category.trim().toLowerCase();
        return trimmedCategory === "shopping"
          ? "Shop"
          : trimmedCategory.charAt(0).toUpperCase() + trimmedCategory.slice(1);
      });

      // Retrieve Category entities
      const categoryEntities: Category[] = [];
      for (const categoryName of categories) {
        const category = await categoryService.getByName(categoryName);
        if (category) {
          categoryEntities.push(category);
        } else {
          console.warn(`Category not found: ${categoryName}`);
        }
      }

      // Create the place object
      const placeData = {
        name,
        address,
        city,
        state,
        country,
        website,
        categories: categoryEntities as Category[],
        short_description,
        long_description,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        rating: rating ? parseFloat(rating) : null,
        reviews: reviews ? parseInt(reviews, 10) : null,
      };

      // Create the place
      const newPlace = await placeService.create(placeData as any);

      // Associate the image with the newly created place
      if (image_url) {
        await imageService.create({ src: image_url, place: newPlace });
      }

      console.log(`Place created with ID: ${newPlace.id}`);
    }

    console.log("File processing completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error processing JSON file:", error);
    process.exit(1);
  }
}

// Example usage:
const jsonFilePath =
  "/Users/Curt/Documents/Travel-Monorepo/packages/app-db/src/seed/with_s3_image.json"; // Replace with your JSON file path
processJsonFile(jsonFilePath);
