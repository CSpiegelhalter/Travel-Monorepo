import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../models";
import { RepositoryController } from "../contoller/RepositoryController";

type UserModel = {
  username: string;
  email: string;
  id: string;
};

@Injectable()
export class UserService {
  private placeRepository: Repository<User>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.placeRepository =
      this.repositoryController.getRepository<User>("User");
  }

  public async create(user: UserModel): Promise<User> {
    const { email, username, id } = user;
    return this.placeRepository.save({
      username,
      email,
      id,
    });
  }

  public async getById(id: string): Promise<User> {
    return this.placeRepository
      .createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id })
      .getOne();
  }
}
