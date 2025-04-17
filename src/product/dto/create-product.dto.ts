import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsUrl,
  IsDateString,
  IsEmail,
} from 'class-validator';

class DimensionsDto {
  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  depth: number;
}

class ReviewDto {
  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsString()
  reviewerName: string;

  @ApiProperty()
  @IsEmail()
  reviewerEmail: string;
}

class MetaDto {
  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  barcode: string;

  @ApiProperty()
  @IsUrl()
  qrCode: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  _id: String;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNumber()
  stock: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty()
  @IsString()
  warrantyInformation: string;

  @ApiProperty()
  @IsString()
  shippingInformation: string;

  @ApiProperty()
  @IsString()
  availabilityStatus: string;

  @ApiProperty({ type: [ReviewDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @ApiProperty()
  @IsString()
  returnPolicy: string;

  @ApiProperty()
  @IsNumber()
  minimumOrderQuantity: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty()
  @IsUrl()
  thumbnail: string;
}