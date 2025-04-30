import {Controller,Get,Post,Body,Param,Put,Delete,Query,UploadedFiles,UploadedFile,UseInterceptors, Logger,} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { CreateProductWithFilesDto } from './dto/create-product-with-files.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productsService: ProductService) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ], multerOptions))
    async create(
      @Body() createProductDto: CreateProductWithFilesDto,
      @UploadedFiles() files: { thumbnail?: Express.Multer.File[], images?: Express.Multer.File[] },
    ) {
      console.log('Received DTO:', createProductDto);
      console.log('Received images:', files.images?.length);
      console.log('Received thumbnail:', files.thumbnail?.[0]?.filename);
      
      return this.productsService.create(createProductDto, { 
        images: files.images, 
        thumbnail: files.thumbnail?.[0] 
      });
    }
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.productsService.search(query);
    }

    @Get('category/:category')
    findByCategory(@Param('category') category: string) {
        return this.productsService.findByCategory(category);
    }

    @Get(':id')
    findOne(@Param('id') _id: string) {
        return this.productsService.findOne(_id);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ], multerOptions))
    async update(
      @Param('id') _id: string,
      @Body() updateProductDto: CreateProductWithFilesDto,
      @UploadedFiles() images?: Express.Multer.File[],
      @UploadedFile() thumbnail?: Express.Multer.File,
    ) {
      return await this.productsService.update(_id, updateProductDto, {
        images,
        thumbnail,
      });
    }

    @Delete(':id')
    remove(@Param('id') _id: string) {
        return this.productsService.remove(_id);
    }
}