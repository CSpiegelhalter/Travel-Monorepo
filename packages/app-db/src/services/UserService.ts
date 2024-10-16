import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProfilePicture, User } from "../models";
import { RepositoryController } from "../contoller/RepositoryController";

type UserModel = {
  username: string;
  email: string;
  id: string;
};

@Injectable()
export class UserService {
  private repo: Repository<User>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo = this.repositoryController.getRepository<User>("User");
  }

  public async create(user: UserModel): Promise<User> {
    const { email, username, id } = user;
    return this.repo.save({
      username,
      email,
      id,
    });
  }

  public async saveProfilePicture({
    userId,
    profilePicture,
  }: {
    userId: string;
    profilePicture: ProfilePicture;
  }): Promise<User> {
    return this.repo.save({
      profilePicture,
      id: userId,
    });
  }

  public async getById(id: string): Promise<User> {
    return this.repo
      .createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id })
      .getOne();
  }

  public async getUserSavedPlaces(id: string): Promise<User> {
    return this.repo.findOne({
      where: { id },
      relations: ["savedPlaces"],
    });
  }

  public async getUserHasBeenPlaces(id: string): Promise<User> {
    return this.repo.findOne({
      where: { id },
      relations: ["userHasBeen"],
    });
  }

  public async getRole(userId: string): Promise<string> {
    const userRecord = await this.repo.findOne({
      where: { id: userId },
      select: ["role"],
    });

    return userRecord.role;
  }
}
