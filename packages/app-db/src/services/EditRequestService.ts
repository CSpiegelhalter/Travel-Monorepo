import { BadRequestException, Injectable } from "@nestjs/common";
import { Point, Repository } from "typeorm";
import { CreatePlaceDto } from "../dto/place.dto";
import { Place } from "../models/Place";
import { RepositoryController } from "../contoller/RepositoryController";
import { EditRequest } from "../models";

interface EditRequestCreateParams {
  placeId: string;
  userId: string;
  requestedChanges: any;
}

const STATUSES = ["pending", "approved", "declined"] as const;
type Status = (typeof STATUSES)[number];

@Injectable()
export class EditRequestService {
  private placeRepository: Repository<EditRequest>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.placeRepository =
      this.repositoryController.getRepository<EditRequest>("EditRequest");
  }

  public async create({
    placeId,
    userId,
    requestedChanges,
  }: EditRequestCreateParams): Promise<EditRequest> {
    return this.placeRepository.save({
      placeId,
      userId,
      requestedChanges,
    });
  }

  public async getManyByStatus(status: Status): Promise<EditRequest[]> {
    return this.placeRepository
      .createQueryBuilder("editRequest")
      .select()
      .where("editRequest.status = :status", { status })
      .getMany();
  }

  public async getById(id: string): Promise<EditRequest> {
    return this.placeRepository
      .createQueryBuilder("editRequest")
      .select()
      .leftJoinAndSelect("editRequest.place", "place")
      .where("editRequest.id = :id", { id })
      .getOne();
  }
}
