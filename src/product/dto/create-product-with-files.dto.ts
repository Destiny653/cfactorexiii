import { IsNumber, IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class DimensionsDto {
  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  depth?: number;
}

class ReviewDto {
  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsString()
  reviewerName?: string;

  @IsOptional()
  @IsString()
  reviewerEmail?: string;
}

class MetaDto {
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  qrCode?: string;
}

export class CreateProductWithFilesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsString()
  @IsOptional()
  warrantyInformation?: string;

  @IsString()
  @IsOptional()
  shippingInformation?: string;

  @IsString()
  @IsOptional()
  availabilityStatus?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews?: ReviewDto[];

  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @IsNumber()
  @IsOptional()
  minimumOrderQuantity?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MetaDto)
  meta?: MetaDto;

  // These will be handled as files (no decorators needed here)
  images?: any[];
  thumbnail?: any;
}