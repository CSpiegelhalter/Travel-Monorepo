import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Place } from "../models/Place";
import { RepositoryController } from "../contoller/RepositoryController";
import { AddRequest, User } from "../models";

interface AddRequestCreateParams {
  user: User;
  placeData: any;
  additionalComments: string;
}

const STATUSES = ["pending", "approved", "declined"] as const;
type Status = (typeof STATUSES)[number];

@Injectable()
export class AddRequestService {
  private repo: Repository<AddRequest>;

  constructor(private readonly repositoryController: RepositoryController) {
    this.repo =
      this.repositoryController.getRepository<AddRequest>("AddRequest");
  }

  public async create({
    user,
    placeData,
    additionalComments,
  }: AddRequestCreateParams): Promise<AddRequest> {
    return this.repo.save({
      user,
      placeData,
      status: "pending",
      additionalComments,
    });
  }

  public async getManyByStatus(status: Status): Promise<AddRequest[]> {
    return this.repo
      .createQueryBuilder("addRequest")
      .select()
      .where("addRequest.status = :status", { status })
      .getMany();
  }

  public async getById(id: string): Promise<AddRequest> {
    return this.repo
      .createQueryBuilder("addRequest")
      .select()
      .leftJoinAndSelect("addRequest.place", "place")
      .leftJoinAndSelect("addRequest.user", "user")
      .where("addRequest.id = :id", { id })
      .getOne();
  }

  public async update({
    id,
    status,
    placeData,
    place,
  }: {
    id: string;
    status: "accepted" | "pending" | "declined";
    placeData?: any;
    place?: Place;
  }): Promise<AddRequest | null> {
    const addRequest = await this.repo.findOne({ where: { id: Number(id) } });

    if (!addRequest) {
      throw new Error(`AddRequest with id ${id} not found`);
    }

    // Update the status
    addRequest.status = status;
    if (placeData) {
      addRequest.placeData = placeData;
    }
    if (place) {
      addRequest.place = place;
    }

    // Save the updated AddRequest
    await this.repo.save(addRequest);

    return addRequest;
  }
}
