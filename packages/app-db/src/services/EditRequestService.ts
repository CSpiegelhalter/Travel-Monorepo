import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Place } from "../models/Place";
import { RepositoryController } from "../contoller/RepositoryController";
import { EditRequest, User } from "../models";

interface EditRequestCreateParams {
  place: Place;
  user: User;
  requestedChanges: any;
}

const STATUSES = ["pending", "approved", "declined"] as const;
type Status = (typeof STATUSES)[number];

@Injectable()
export class EditRequestService {
  private repo: Repository<EditRequest>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo =
      this.repositoryController.getRepository<EditRequest>("EditRequest");
  }

  public async create({
    place,
    user,
    requestedChanges,
  }: EditRequestCreateParams): Promise<EditRequest> {
    return this.repo.save({
      place,
      user,
      requestedChanges,
    });
  }

  public async getManyByStatus(status: Status): Promise<EditRequest[]> {
    return this.repo
      .createQueryBuilder("editRequest")
      .select()
      .where("editRequest.status = :status", { status })
      .getMany();
  }

  public async getById(id: string): Promise<EditRequest> {
    return this.repo
      .createQueryBuilder("editRequest")
      .select()
      .leftJoinAndSelect("editRequest.place", "place")
      .where("editRequest.id = :id", { id })
      .getOne();
  }
}
