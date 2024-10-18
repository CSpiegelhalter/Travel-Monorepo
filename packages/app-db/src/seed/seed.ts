import { Place } from "../models/Place";
import { PlaceService } from "../services/PlaceService";
import { repositoryController } from "../contoller/RepositoryController";
import { Category } from "../models";
import { CategoryService } from "../services/CategoryService";
import { ImageService } from "../services";
import { placeSeedData } from "./testData";

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

// Run the seed function
seed();
