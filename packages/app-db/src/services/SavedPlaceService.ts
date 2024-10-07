import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Place, User } from "../models";
import { RepositoryController } from "../contoller/RepositoryController";

@Injectable()
export class SavedPlaceService {
  private placeRepo: Repository<Place>;
  private userRepo: Repository<User>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.placeRepo = this.repositoryController.getRepository<Place>("Place");
    this.userRepo = this.repositoryController.getRepository<User>("User");
  }

  /**
   * Save a place for a user
   * @param user - The user saving the place
   * @param place - The place to save
   * @returns The updated user entity with saved places
   */
  public async savePlaceForUser(user: User, place: Place): Promise<User> {
    // Check if the place is already saved by the user
    if (user.savedPlaces.some((savedPlace) => savedPlace.id === place.id)) {
      throw new Error("Place already saved by user");
    }

    user.savedPlaces.push(place); // Add the place to the user's saved places

    return await this.userRepo.save(user); // Save the updated user entity
  }

  public async unsavePlaceForUser(user: User, place: Place): Promise<User> {
    // Check if the place is saved by the user
    const placeIndex = user.savedPlaces.findIndex(
      (savedPlace) => savedPlace.id === place.id
    );

    if (placeIndex === -1) {
      throw new Error("Place not saved by user");
    }

    // Remove the place from the user's saved places
    user.savedPlaces.splice(placeIndex, 1);

    return await this.userRepo.save(user); // Save the updated user entity
  }

  public async isPlaceSavedByUser(
    userId: string,
    placeId: string
  ): Promise<boolean> {
    const savedCount = await this.userRepo
      .createQueryBuilder("user")
      .innerJoin("user.savedPlaces", "place")
      .where("user.id = :userId", { userId })
      .andWhere("place.id = :placeId", { placeId })
      .getCount();

    return savedCount > 0;
  }
}
