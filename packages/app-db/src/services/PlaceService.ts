import { BadRequestException, Injectable } from "@nestjs/common";
import {
  FindManyOptions,
  Point,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { CreatePlaceDto } from "../dto/place.dto";
import { Place } from "../models/Place";
import { RepositoryController } from "../contoller/RepositoryController";

@Injectable()
export class PlaceService {
  private repo: Repository<Place>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo = this.repositoryController.getRepository<Place>("Place");
  }

  public async create(place: CreatePlaceDto): Promise<Place> {
    const coordinates: Point = {
      type: "Point",
      coordinates: [place.longitude, place.latitude],
    };

    return this.repo.save({
      name: place.name,
      address: place.address,
      city: place.city,
      state: place.state,
      country: place.country,
      website: place.website,
      categories: place.categories,
      short_description: place.short_description,
      long_description: place.long_description,
      images: place.images,
      rating: place.rating,
      reviews: place.reviews,
      latitude: place.latitude,
      longitude: place.longitude,
      location: coordinates,
    });
  }

  public async getWithinRange(
    longitude: number,
    latitude: number,
    rangeKm: number
  ): Promise<Place[]> {
    const isValidLongitude = longitude >= -180 && longitude <= 180;
    const isValidLatitude = latitude >= -90 && latitude <= 90;

    if (!isValidLongitude || !isValidLatitude) {
      throw new BadRequestException("Invalid coordinates");
    }

    return this.repo
      .createQueryBuilder("place")
      .select()
      .leftJoinAndSelect("place.editedByUsers", "editedByUsers")
      .leftJoinAndSelect("place.addedByUser", "addedByUser")
      .leftJoinAndSelect("place.categories", "categories")
      .where(
        "ST_DWithin(place.coordinates, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :range)",
        { lon: longitude, lat: latitude, range: rangeKm * 1000 }
      )
      .getMany();
  }

  public async getMany(userId?: string): Promise<Place[]> {
    console.log("in the get many");
    const query = this.repo
      .createQueryBuilder("place")
      .select([
        "place.id",
        "place.name",
        "place.short_description",
        "place.rating",
        "place.reviews",
        "place.images",
        "place.latitude",
        "place.longitude",
      ]);

    if (userId) {
      console.log("I HAVE THE USER ID");
      query
        .leftJoin("place.savedByUsers", "savedByUsers")
        .addSelect(
          "CASE WHEN savedByUsers.id IS NOT NULL THEN true ELSE false END",
          "isSaved"
        )
        .where("savedByUsers.id = :userId OR savedByUsers.id IS NULL", {
          userId,
        });
    }

    const { entities, raw } = await query.take(25).getRawAndEntities();

    // Map `isSaved` value from raw data to entities
    return entities.map((place, index) => {
      place["isSaved"] = raw[index].isSaved;
      return place;
    });
  }

  public async getById(id: string): Promise<Place> {
    const placeWithSavedCount = await this.repo
      .createQueryBuilder("place")
      .leftJoinAndSelect("place.editedByUsers", "editedByUsers")
      .leftJoinAndSelect("place.addedByUser", "addedByUser")
      .leftJoinAndSelect("place.categories", "categories")
      .leftJoin("place.savedByUsers", "savedByUsers")
      .addSelect("COUNT(savedByUsers.id)", "savedCount")
      .where("place.id = :id", { id: Number(id) })
      .groupBy("place.id")
      .addGroupBy("editedByUsers.id")
      .addGroupBy("addedByUser.id")
      .addGroupBy("categories.id")
      .getRawAndEntities();

    const { entities, raw } = placeWithSavedCount;

    // Attach the saved count to the Place entity
    const place = entities[0];
    place["savedCount"] = parseInt(raw[0].savedCount, 10);

    return place;
  }

  public async getEditedUsers(placeId: string): Promise<Place> {
    return this.repo.findOne({
      where: { id: Number(placeId) },
      relations: ["editedByUsers"],
    });
  }

  // public async getMany(userId?: string): Promise<Place[]> {
  //   const query = this.repo
  //     .createQueryBuilder("place")
  //     .leftJoinAndSelect(
  //       "SavedPlace", // The SavedPlace table
  //       "savedPlace", // Alias for SavedPlace
  //       "savedPlace.placeId = place.id AND savedPlace.userId = :userId", // Join condition
  //       { userId } // Pass the userId as a parameter
  //     )
  //     .select([
  //       "place", // Select all fields from the Place table
  //       "CASE WHEN savedPlace.userId IS NOT NULL THEN true ELSE false END AS isSaved", // Add isSaved field
  //     ])
  //     .take(25);

  //   return query.getRawMany();
  // }
}
