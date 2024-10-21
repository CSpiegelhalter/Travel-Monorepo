import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Place, User } from "../models";
import { RepositoryController } from "../contoller/RepositoryController";

@Injectable()
export class HasBeenService {
  private userRepo: Repository<User>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.userRepo = this.repositoryController.getRepository<User>("User");
  }

  /**
   * Save a place for a user
   * @param user - The user saving the place
   * @param place - The place to save
   * @returns The updated user entity with saved places
   */
  public async saveHasBeenForUser(user: User, place: Place): Promise<User> {
    // Check if the place is already saved by the user
    if (user.userHasBeen.some((hasBeen) => hasBeen.id === place.id)) {
      throw new Error("User has already been to this place.");
    }

    user.userHasBeen.push(place); // Add the place to the user's saved places

    return await this.userRepo.save(user); // Save the updated user entity
  }

  public async unsaveHasBeenForUser(user: User, place: Place): Promise<User> {
    // Check if the place is saved by the user
    const placeIndex = user.userHasBeen.findIndex(
      (hasBeen) => hasBeen.id === place.id
    );

    if (placeIndex === -1) {
      throw new Error("Place not saved by user");
    }

    // Remove the place from the user's saved places
    user.userHasBeen.splice(placeIndex, 1);

    return await this.userRepo.save(user); // Save the updated user entity
  }

  public async hasUserBeen(userId: string, placeId: string): Promise<boolean> {
    const hasBeenCount = await this.userRepo
      .createQueryBuilder("user")
      .innerJoin("user.userHasBeen", "place")
      .where("user.id = :userId", { userId })
      .andWhere("place.id = :placeId", { placeId })
      .getCount();

    return hasBeenCount > 0;
  }
}
