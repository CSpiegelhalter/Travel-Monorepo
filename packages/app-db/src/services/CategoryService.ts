import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RepositoryController } from "../contoller/RepositoryController";
import { Category } from "../models";

@Injectable()
export class CategoryService {
  private repo: Repository<Category>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo = this.repositoryController.getRepository<Category>("Category");
  }

  public async create(name: string): Promise<Category> {
    return this.repo.save({
      name: name,
    });
  }

  public async getByName(name: string): Promise<Category> {
     if (!name) {
       return null; // Return null or handle as needed if name is undefined or empty
     }
    return this.repo.findOne({
      where: { name },
    });
  }

  public async getAll(): Promise<Category[]> {
    return this.repo.find();
  }
}
