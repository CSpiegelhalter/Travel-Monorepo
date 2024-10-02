import { AppDataSource } from "../typeorm.config";
import { Place } from "../models/Place";
import { PlaceService } from "../services/PlaceService";
import { repositoryController } from "../contoller/RepositoryController";

const seed = async () => {
  try {
    // Initialize the DataSource
    await AppDataSource.initialize();

    // Define seed data for the Place entity
    const placeSeedData: Partial<Place>[] = [
      {
        name: "Sample Place 1",
        address: "123 Sample St",
        city: "Sample City",
        state: "Sample State",
        country: "Sample Country",
        website: "http://sampleplace1.com",
        categories: "Sample Category",
        short_description: "A short description of Sample Place 1",
        long_description: "A longer description of Sample Place 1",
        images: "http://sampleplace1.com/image1.jpg",
        rating: 4.5,
        reviews: 123,
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        name: "Eiffel Tower start 2222",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Attraction",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "There",
        country: "Wonderful",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Bar",
        images:
          "data:image/jpeg;base64,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",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://static.boredpanda.com/blog/wp-content/uploads/2014/04/amazing-places-to-see-before-you-die-8-2.jpg",
      },
      {
        name: "rocksss",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        reviews: 123,
        short_description: "roccckkssss",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://static.boredpanda.com/blog/wp-content/uploads/2014/03/amazing-places-to-see-before-you-die-6.jpg",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
      {
        name: "Eiffel Tower start",
        address: "123 somewhere in Paris",
        city: "Paris",
        country: "France",
        rating: 4,
        reviews: 123,
        short_description:
          "The Eiffel Tower is an iconic iron lattice structure located in Paris, France, known for its towering height and distinctive silhouette. Built in 1889, it serves as a symbol of French engineering prowess and attracts millions of visitors annually with its panoramic views of the city.",
        long_description: `The Eiffel Tower stands tall and proud as an architectural marvel in the heart of Paris, France. Designed by Gustave Eiffel, this iconic iron lattice structure has become an enduring symbol of the city and a testament to human ingenuity. Standing at a towering height of 330 meters (1,083 feet), the Eiffel Tower held the title of the tallest man-made structure in the world for over 40 years. Constructed between 1887 and 1889, the tower was initially met with mixed reactions from the public. However, it quickly captured the imagination of people worldwide and became a beloved landmark. Composed of intricate wrought-iron latticework, the Eiffel Tower boasts an open framework that allows visitors to appreciate the grandeur of its design while providing breathtaking views of the surrounding cityscape  .Ascending the tower is an experience in itself. Visitors can choose between taking the stairs or elevators to reach the different levels, each offering unique vantage points. The first two levels house restaurants, shops, and exhibits that delve into the tower's history, while the summit provides panoramic views of Paris, with notable landmarks like the Seine River, Notre-Dame Cathedral, and the Arc de Triomphe visible from above. As a cultural icon, the Eiffel Tower has been featured in countless films, artworks, and photographs, further cementing its status as a global symbol of romance, elegance, and architectural brilliance. Its allure draws millions of tourists each year, all eager to marvel at its beauty and capture a piece of its timeless splendor.`,
        latitude: 48.8584,
        longitude: 2.2945,
        categories: "Tourist",
        images:
          "https://lh5.googleusercontent.com/p/AF1QipOnJHzIOu1VUvkTX0GKjmqK-NdgXWJEUa8m2YPd=s549-k-no",
      },
    ];
    await repositoryController.initializeRepositories();
    const service = new PlaceService(repositoryController);
    for (const place of placeSeedData) {
      await service.create(place as Place);
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
