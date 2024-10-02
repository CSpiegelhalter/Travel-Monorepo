import { BadRequestException, Injectable } from "@nestjs/common";
import { Point, Repository } from "typeorm";
import { CreatePlaceDto } from "../dto/place.dto";
import { Place } from "../models/Place";
import {
  RepositoryController,
} from "../contoller/RepositoryController";

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.placeRepository =
      this.repositoryController.getRepository<Place>("Place");
  }

  public async create(place: CreatePlaceDto): Promise<Place> {
    const coordinates: Point = {
      type: "Point",
      coordinates: [place.longitude, place.latitude],
    };

    return this.placeRepository.save({
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

    return this.placeRepository
      .createQueryBuilder("place")
      .select()
      .where(
        "ST_DWithin(place.coordinates, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :range)",
        { lon: longitude, lat: latitude, range: rangeKm * 1000 }
      )
      .getMany();
  }

  public async getMany(): Promise<Place[]> {
    return this.placeRepository
      .createQueryBuilder("place")
      .select()
      .take(25)
      .getMany();
  }
}
