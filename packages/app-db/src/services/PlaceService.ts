import { BadRequestException, Injectable } from "@nestjs/common";
import { Point, Repository } from "typeorm";
import { CreatePlaceDto } from "../dto/place.dto";
import { Place } from "../models/Place";
import { RepositoryController } from "../contoller/RepositoryController";
import { User } from "../models";

@Injectable()
export class PlaceService {
  private repo: Repository<Place>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo = this.repositoryController.getRepository<Place>("Place");
  }

  public async create(
    place: CreatePlaceDto,
    addedByUser?: User
  ): Promise<Place> {
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
      rating: place.rating,
      reviews: place.reviews,
      latitude: place.latitude,
      longitude: place.longitude,
      location: coordinates,
      addedByUser: addedByUser ?? null,
    });
  }

  public async getWithinRange({
    longitude,
    latitude,
    rangeKm = 100,
    page = 1,
    pageSize = 16,
  }: {
    longitude: number;
    latitude: number;
    rangeKm: number;
    page: number;
    pageSize: number;
  }): Promise<{
    places: Place[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const isValidLongitude = longitude >= -180 && longitude <= 180;
    const isValidLatitude = latitude >= -90 && latitude <= 90;

    if (!isValidLongitude || !isValidLatitude) {
      throw new BadRequestException("Invalid coordinates");
    }

    const { entities, raw } = await this.repo
      .createQueryBuilder("place")
      .select()
      .leftJoinAndSelect("place.images", "image", "image.placeId = place.id")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place.images"
      )
      // .leftJoinAndSelect("place.categories", "categories")
      .where(
        "ST_DWithin(place.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :range)",
        { lon: longitude, lat: latitude, range: rangeKm * 1000 }
      )
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo
      .createQueryBuilder("place")
      .where(
        "ST_DWithin(place.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :range)",
        { lon: longitude, lat: latitude, range: rangeKm * 1000 }
      )
      .getCount();

    const places = entities.map((place, index) => {
      // Extract and assign images, limiting to 3
      place.images = raw
        .filter((row) => row.place_id === place.id)
        .map((row) => row.image_src)
        .slice(0, 3);

      return place;
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      places,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async getMany({
    userId,
    page = 1,
    pageSize = 16,
  }: {
    userId?: string;
    page: number;
    pageSize: number;
  }): Promise<any> {
    console.log("in the get many");

    const query = this.repo
      .createQueryBuilder("place")
      .select([
        "place.id",
        "place.name",
        "place.short_description",
        "place.rating",
        "place.reviews",
        "place.latitude",
        "place.longitude",
      ])
      .leftJoinAndSelect("place.images", "image", "image.placeId = place.id")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place.images"
      );

    const { entities, raw } = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo.createQueryBuilder("place").getCount();

    const totalPages = Math.ceil(total / pageSize);

    // Map `isSaved` value from raw data to entities
    const places = entities.map((place, index) => {
      // Extract and assign images, limiting to 3
      place.images = raw
        .filter((row) => row.place_id === place.id)
        .map((row) => row.image_src)
        .slice(0, 3);

      return place;
    });

    return {
      places,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async getById(id: string): Promise<Place> {
    const placeWithSavedCount = await this.repo
      .createQueryBuilder("place")
      .leftJoinAndSelect("place.editedByUsers", "editedByUsers")
      .leftJoinAndSelect("place.addedByUser", "addedByUser")
      .leftJoinAndSelect("place.categories", "categories")
      .leftJoin("place.savedByUsers", "savedByUsers")
      .leftJoin("place.usersHaveBeen", "usersHaveBeen")
      .addSelect("COUNT(savedByUsers.id)", "savedCount")
      .addSelect("COUNT(usersHaveBeen.id)", "usersHaveBeenCount")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "images"
      )
      .where("place.id = :id", { id: Number(id) })
      .groupBy("place.id")
      .addGroupBy("editedByUsers.id")
      .addGroupBy("addedByUser.id")
      .addGroupBy("categories.id")
      .getRawAndEntities();

    const { entities, raw } = placeWithSavedCount;

    const place = entities[0];
    if (!place) {
      return place;
    }
    const rawData = raw[0] || {};

    // Safely assign the additional properties
    place["savedCount"] = parseInt(rawData.savedCount || "0", 10);
    place["usersHaveBeenCount"] = parseInt(
      rawData.usersHaveBeenCount || "0",
      10
    );
    place["images"] = rawData.images || [];

    return place;
  }

  public async getEditedUsers(placeId: string): Promise<Place> {
    return this.repo.findOne({
      where: { id: Number(placeId) },
      relations: ["editedByUsers"],
    });
  }

  public async updatePlace(
    id: string,
    updatedFields: Partial<Place>
  ): Promise<Place> {
    // Fetch the current Place entity, including `editedByUsers`
    const place = await this.repo.findOne({
      where: { id: Number(id) },
      relations: ["editedByUsers"], // Include editedByUsers to manage this relation
    });

    if (!place) {
      throw new Error(`Place with id ${id} not found`);
    }

    // Update the basic fields from `updatedFields`
    Object.assign(place, updatedFields);

    // If `updatedFields` includes `editedByUsers`, handle the relation separately
    if (updatedFields.editedByUsers) {
      place.editedByUsers = updatedFields.editedByUsers;
    }

    // Save the updated Place entity with updated relationships
    const updatedPlace = await this.repo.save(place);

    return updatedPlace;
  }

  public async getUserRelatedCounts(userId: string): Promise<{
    addedCount: number;
    editedCount: number;
    savedCount: number;
    usersHaveBeenCount: number;
  }> {
    const queryBuilder = this.repo
      .createQueryBuilder("place")
      .select([
        "COUNT(DISTINCT CASE WHEN addedByUser.id = :userId THEN place.id END) AS addedcount",
        "COUNT(DISTINCT CASE WHEN editedByUsers.id = :userId THEN place.id END) AS editedcount",
        "COUNT(DISTINCT CASE WHEN savedByUsers.id = :userId THEN place.id END) AS savedcount",
        "COUNT(DISTINCT CASE WHEN usersHaveBeen.id = :userId THEN place.id END) AS usersHaveBeenCount",
      ])
      .leftJoin("place.addedByUser", "addedByUser")
      .leftJoin("place.editedByUsers", "editedByUsers")
      .leftJoin("place.savedByUsers", "savedByUsers")
      .leftJoin("place.usersHaveBeen", "usersHaveBeen")
      .setParameter("userId", userId);

    console.log("Generated SQL Query:", queryBuilder.getSql());
    console.log("Query Parameters:", { userId });

    const result = await queryBuilder.getRawOne();

    if (!result) {
      console.error("No results found for userId:", userId);
      return {
        addedCount: 0,
        editedCount: 0,
        savedCount: 0,
        usersHaveBeenCount: 0,
      };
    }

    console.log("Raw Query Result:", result);

    const addedCount = parseInt(result.addedcount, 10) || 0;
    const editedCount = parseInt(result.editedcount, 10) || 0;
    const savedCount = parseInt(result.savedcount, 10) || 0;
    const usersHaveBeenCount = parseInt(result.usersHaveBeenCount, 10) || 0;

    return { addedCount, editedCount, savedCount, usersHaveBeenCount };
  }

  public async getSavedPlacesByUser(userId: string, page = 1, pageSize = 16) {
    const { entities: places, raw } = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.savedByUsers", "savedByUsers")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)", "images")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place_images"
      )
      .where("savedByUsers.id = :userId", { userId })
      .orderBy("place.id", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.savedByUsers", "savedByUsers")
      .where("savedByUsers.id = :userId", { userId })
      .getCount();

    const totalPages = Math.ceil(total / pageSize);

    // Manually add `images` as an array of strings to each `place`
    const placesWithImages = places.map((place, index) => {
      const rawPlace = raw[index];
      return {
        ...place,
        images: rawPlace.place_images || [], // `place_images` should contain only `src` values as strings
      };
    });

    return {
      places: placesWithImages,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async getEditedPlacesByUser(userId: string, page = 1, pageSize = 15) {
    const { entities: places, raw } = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.editedByUsers", "editedByUsers")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)", "images")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place_images"
      )
      .where("editedByUsers.id = :userId", { userId })
      .orderBy("place.id", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.editedByUsers", "editedByUsers")
      .where("editedByUsers.id = :userId", { userId })
      .getCount();
    const totalPages = Math.ceil(total / pageSize);

    const placesWithImages = places.map((place, index) => {
      const rawPlace = raw[index];
      return {
        ...place,
        images: rawPlace.place_images || [], // `place_images` should contain only `src` values as strings
      };
    });

    return {
      places: placesWithImages,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async getAddedPlacesByUser(userId: string, page = 1, pageSize = 15) {
    const { entities: places, raw } = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.addedByUser", "addedByUser")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)", "images")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place_images"
      )
      .where("addedByUser.id = :userId", { userId })
      .orderBy("place.id", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.addedByUser", "addedByUser")
      .where("addedByUser.id = :userId", { userId })
      .getCount();
    const totalPages = Math.ceil(total / pageSize);

    const placesWithImages = places.map((place, index) => {
      const rawPlace = raw[index];
      return {
        ...place,
        images: rawPlace.place_images || [], // `place_images` should contain only `src` values as strings
      };
    });

    return {
      places: placesWithImages,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
  public async getUserHasBeenPlaces(userId: string, page = 1, pageSize = 16) {
    const { entities: places, raw } = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.usersHaveBeen", "usersHaveBeen")
      .addSelect(
        (subQuery) =>
          subQuery
            .select("ARRAY_AGG(image.src)", "images")
            .from("image", "image")
            .where("image.placeId = place.id")
            .limit(3),
        "place_images"
      )
      .where("usersHaveBeen.id = :userId", { userId })
      .orderBy("place.id", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const total = await this.repo
      .createQueryBuilder("place")
      .leftJoin("place.usersHaveBeen", "usersHaveBeen")
      .where("usersHaveBeen.id = :userId", { userId })
      .getCount();

    const totalPages = Math.ceil(total / pageSize);

    // Manually add `images` as an array of strings to each `place`
    const placesWithImages = places.map((place, index) => {
      const rawPlace = raw[index];
      return {
        ...place,
        images: rawPlace.place_images || [], // `place_images` should contain only `src` values as strings
      };
    });

    return {
      places: placesWithImages,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
