import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema'; 
import { CreateProductWithFilesDto } from './dto/create-product-with-files.dto';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductWithFilesDto, files?: { 
    images?: Express.Multer.File[], 
    thumbnail?: Express.Multer.File 
  }) {
    try {
      const productData: any = { ...createProductDto };
  
      // Handle images
      if (files?.images) {
        productData.images = files.images.map(file => 
          `${process.env.BASIC_URL}/uploads/products/${file.filename}`
        );
      }
  
      // Handle thumbnail (use first image as thumbnail if not specified)
      if (files?.thumbnail) {
        productData.thumbnail = `${process.env.BASIC_URL}/uploads/products/${files.thumbnail.filename}`;
      } else if (files?.images && files.images.length > 0) {
        productData.thumbnail = `${process.env.BASIC_URL}/uploads/products/${files.images[0].filename}`;
      }
  
      return await new this.productModel(productData).save();
    } catch (error) {
      // Clean up uploaded files if creation fails
      if (files?.images) {
        files.images.forEach(file => {
          fs.unlinkSync(join(process.cwd(), 'uploads', 'products', file.filename));
        });
      }
      if (files?.thumbnail) {
        fs.unlinkSync(join(process.cwd(), 'uploads', 'products', files.thumbnail.filename));
      }
      throw error;
    }
  }
  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(  _id: String): Promise<Product | null> {
    return this.productModel.findOne({ _id }).exec();
  }

  async update(
    _id: String,
    updateProductDto: CreateProductWithFilesDto,
    files?: {
      images?: Express.Multer.File[];
      thumbnail?: Express.Multer.File;
    }
  ): Promise<Product | null> {
    let oldProduct: Product | null = null;
    
    // Get the old product if we need to clean up old files
    if (files) {
      oldProduct = await this.productModel.findOne({ _id }).exec();
    }
  
    try {
      const updateData: any = { ...updateProductDto };
  
      if (files) {
        if (files.images) {
          updateData.images = files.images.map(file => `/uploads/products/${file.filename}`);
        }
        if (files.thumbnail) {
          updateData.thumbnail = `/uploads/products/${files.thumbnail.filename}`;
        }
      }
  
      const updatedProduct = await this.productModel
        .findOneAndUpdate({ _id }, updateData, { new: true })
        .exec();
  
      // Clean up old files after successful update
      if (oldProduct && files) {
        if (files.thumbnail && oldProduct.thumbnail) {
          fs.unlinkSync(join(process.cwd(), oldProduct.thumbnail));
        }
        if (files.images && oldProduct.images) {
          oldProduct.images.forEach(image => {
            fs.unlinkSync(join(process.cwd(), image));
          });
        }
      }
  
      return updatedProduct;
    } catch (error) {
      // Clean up newly uploaded files if update fails
      if (files) {
        if (files.images) {
          files.images.forEach(file => {
            fs.unlinkSync(join(process.cwd(), 'uploads', 'products', file.filename));
          });
        }
        if (files.thumbnail) {
          fs.unlinkSync(join(process.cwd(), 'uploads', 'products', files.thumbnail.filename));
        }
      }
      throw error;
    }
  }

  async remove(  _id: String): Promise<Product | null> {
    return this.productModel.findOneAndDelete({  _id }).exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }

  async search(query: string): Promise<Product[]> {
    return this.productModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}