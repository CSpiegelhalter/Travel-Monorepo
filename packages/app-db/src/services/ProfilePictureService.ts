import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RepositoryController } from "../contoller/RepositoryController";
import { ProfilePicture, User } from "../models";

@Injectable()
export class ProfilePictureService {
  private repo: Repository<ProfilePicture>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo =
      this.repositoryController.getRepository<ProfilePicture>("Image");
  }

  public async create({
    src,
    user,
  }: {
    src: string;
    user: User;
  }): Promise<ProfilePicture> {
    return this.repo.save({
      src,
      user: { id: user.id },
    });
  }

  public async delete({ user }: { user: User }): Promise<void> {
    // Find the image based on the src and place
    const image = await this.repo.findOne({
      where: { user: { id: user.id } },
    });

    if (image) {
      // Remove the image if found
      await this.repo.remove(image);
    } else {
      console.log(`Profile pic for userId ${user?.id} not found.`);
    }
  }

  public async getProfilePicture(user: User) {
    const profilePicture = await this.repo
      .createQueryBuilder("profilePicture")
      .innerJoin("profilePicture.user", "user")
      .where("user.id = :userId", { userId: user.id })
      .getOne();

    return profilePicture;
  }
}
