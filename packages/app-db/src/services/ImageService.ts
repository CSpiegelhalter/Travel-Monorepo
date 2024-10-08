import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RepositoryController } from "../contoller/RepositoryController";
import { Image, Place } from "../models";

@Injectable()
export class ImageService {
  private repo: Repository<Image>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo = this.repositoryController.getRepository<Image>("Image");
  }

  public async create({
    src,
    place,
  }: {
    src: string;
    place: Place;
  }): Promise<Image> {
    return this.repo.save({
      src,
      place: { id: place.id },
    });
  }

  public async delete({
    src,
    place,
  }: {
    src: string;
    place: Place;
  }): Promise<void> {
    // Find the image based on the src and place
    const image = await this.repo.findOne({
      where: { src, place: { id: place.id } },
    });

    if (image) {
      // Remove the image if found
      await this.repo.remove(image);
    } else {
      console.log(`Image with src ${src} not found for the specified place.`);
    }
  }

  public async getImages(placeId: string | number, page = 1, pageSize = 3) {
    const [images, total] = await this.repo
      .createQueryBuilder("image")
      .where("image.placeId = :placeId", { placeId })
      .orderBy("image.id", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = Math.ceil(total / pageSize);

    return {
      images,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
