import { PickType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class CreateProductWithFilesDto extends PickType(CreateProductDto, [
  '_id',
  'title',
  'description',
  'category',
  'price',
  'discountPercentage',
  'rating',
  'stock',
  'tags',
  'brand',
  'sku',
  'weight',
  'dimensions',
  'warrantyInformation',
  'shippingInformation',
  'availabilityStatus',
  'reviews',
  'returnPolicy',
  'minimumOrderQuantity',
  'meta',
] as const) {
  // These will be handled as files
  // No decorators needed here - they're added in the controller
  images?: any[];
  thumbnail?: any;
}