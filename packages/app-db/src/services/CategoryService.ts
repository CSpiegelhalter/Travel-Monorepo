import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RepositoryController } from "../contoller/RepositoryController";
import { Category } from "../models";

@Injectable()
export class CategoryService {
  private placeRepository: Repository<Category>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.placeRepository =
      this.repositoryController.getRepository<Category>("Category");
  }

  public async create(name: string): Promise<Category> {
    return this.placeRepository.save({
      name: name,
    });
  }

  public async getByName(name: string): Promise<Category> {
    return this.placeRepository.findOne({
      where: { name },
    });
  }
}
