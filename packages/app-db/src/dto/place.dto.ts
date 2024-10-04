import { IsNumber, Min, Max, IsString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Category } from "../models";

export class CreatePlaceDto {
  @IsString()
  name: string;

  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsString()
  categories: Category[];

  @IsString()
  short_description: string;

  @IsString()
  long_description: string;

  @IsString()
  images: string[];

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  reviews: number;

  @IsNumber()
  @Transform((obj) => parseFloat(obj.value))
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @Transform((obj) => parseFloat(obj.value))
  @Min(-90)
  @Max(90)
  latitude: number;
}
