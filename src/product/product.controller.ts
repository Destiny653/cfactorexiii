import {Controller,Get,Post,Body,Param,Put,Delete,Query,UploadedFiles,UploadedFile,UseInterceptors,} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { CreateProductWithFilesDto } from './dto/create-product-with-files.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productsService: ProductService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', multerOptions),
        FilesInterceptor('images', 10, multerOptions),
    )
    async create(
        @Body() CreateProductDto: CreateProductWithFilesDto ,
        @UploadedFiles() images?: Express.Multer.File[],
        @UploadedFile() thumbnail?: Express.Multer.File,
    ) {
        return await this.productsService.create(CreateProductDto, {
            images,
            thumbnail,
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
    @UseInterceptors(
      FileInterceptor('thumbnail', multerOptions),
      FilesInterceptor('images', 10, multerOptions),
    )
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