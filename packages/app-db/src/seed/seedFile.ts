import { Place } from "../models/Place";
import { PlaceService } from "../services/PlaceService";
import { repositoryController } from "../contoller/RepositoryController";
import { Category } from "../models";
import { CategoryService } from "../services/CategoryService";
import { ImageService } from "../services";
import { placeSeedData } from "./testData";
import * as fs from "fs/promises";
import { parse } from "papaparse";

const seed = async () => {
  try {
    // Define seed data for the Place entity

    await repositoryController.initializeRepositories();
    const placeService = new PlaceService(repositoryController);
    const categoryService = new CategoryService(repositoryController);
    const imageService = new ImageService(repositoryController);
    for (const place of placeSeedData) {
      // Extract the images array and remove it from the place data
      const { images } = place;
      delete place.images;

      // Fetch category entities for the place
      const categoryEntities: Category[] = [];
      for (const categoryName of place.categories) {
        const category = await categoryService.getByName(categoryName);
        categoryEntities.push(category);
      }
      place.categories = categoryEntities as any;

      // Create the Place entity
      const newPlace = await placeService.create(place as any);

      // For each image URL, create an Image entity associated with the new Place
      for (const imageUrl of images) {
        await imageService.create({ src: imageUrl, place: newPlace });
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  }
};

async function processTsvFile(filePath: string) {
  try {
    // Read the entire file content
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Parse the file content using PapaParse
    parse(fileContent, {
      delimiter: "\t",
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await repositoryController.initializeRepositories();
        const placeService = new PlaceService(repositoryController);
        const categoryService = new CategoryService(repositoryController);
        const imageService = new ImageService(repositoryController);

        console.log("Starting to process the file...");

        for (const row of results.data) {
          console.log(row);

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
          } = row as any;

          // Capitalize and split categories
          const categories = categoryStr.split(",").map((category) => {
            const trimmedCategory = category.trim().toLowerCase();
            return trimmedCategory === "shopping"
              ? "Shop"
              : trimmedCategory.charAt(0).toUpperCase() +
                  trimmedCategory.slice(1);
          });

          // Retrieve Category entities
          const categoryEntities: Category[] = [];
          for (const categoryName of categories) {
            const category = await categoryService.getByName(categoryName);
            categoryEntities.push(category);
          }

          // Create the place object
          const placeData = {
            name,
            address,
            city,
            state,
            country,
            website,
            categories: categoryEntities as any,
            short_description,
            long_description,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            rating: rating ? parseFloat(rating) : null,
            reviews: reviews ? parseInt(reviews, 10) : null,
          };

          // Extract image URL
          const imageUrl = image_url;

          // Create the place
          const newPlace = await placeService.create(placeData as any);

          // Associate the image with the newly created place
          await imageService.create({ src: imageUrl, place: newPlace });

          console.log(`Place created with ID: ${newPlace.id}`);
        }

        console.log("File processing completed.");
        process.exit(0);
      },
      error: (error) => {
        console.error("Error parsing the file:", error);
        process.exit(1);
      },
    });
  } catch (error) {
    console.error("Error reading the file:", error);
    process.exit(1);
  }
}

// Run the seed function
processTsvFile(
  "/Users/Curt/Documents/Travel-Monorepo/packages/app-db/src/seed/your-output-file-path.tsv"
);
