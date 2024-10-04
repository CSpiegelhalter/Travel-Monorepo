import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Place } from "../models/Place";
import { AppDataSource } from "../typeorm.config";
import { Category, EditRequest, User } from "../models";

@Injectable()
class RepositoryController {
  private repositories: Map<string, Repository<any>> = new Map();
  private isInitialized = false;

  async initializeRepositories() {
    if (!this.isInitialized) {
      await AppDataSource.initialize();
      this.repositories.set("Place", AppDataSource.getRepository(Place));
      this.repositories.set("User", AppDataSource.getRepository(User));
      this.repositories.set(
        "EditRequest",
        AppDataSource.getRepository(EditRequest)
      );
      this.repositories.set("Category", AppDataSource.getRepository(Category));

      this.isInitialized = true;
    }
  }

  getRepository<T>(entityName: string): Repository<T> {
    if (!this.isInitialized) {
      throw new Error("Repositories are not initialized yet");
    }
    return this.repositories.get(entityName);
  }
}

// Export as a singleton
export const repositoryController = new RepositoryController();
export type { RepositoryController };
