import { BadRequestException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService{
  
  private readonly logger = new Logger('ProductsService');

  constructor(
    private readonly prisma: PrismaService
  ){}

  async create(createProductDto: CreateProductDto) {
    // console.log({createProductDto})
    const product = await this.prisma.product.create({data: createProductDto});
    return product;
  }
  
  async findAll(paginationDto: PaginationDto) {
    const {limit, page} = paginationDto;

    const totalRows = await this.prisma.product.count({where: {available: true}});
    const lastPage = Math.ceil(totalRows/limit!)
    
    const skip = (page!-1) * limit!;
    if(page!>lastPage){
      throw new RpcException(`Error 404: Not exist that page only exists ${lastPage} pages`)
    }
    return {
      data: await this.prisma.product.findMany({skip, take:limit, where:{available:true}}),
      meta: {
        total: totalRows,
        page,
        lastPage
      }
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({where:{id, available: true}})
    if(!product){
      throw new RpcException(
        {
          message: `Product with id ${id} not found`,
          status: HttpStatus.BAD_REQUEST
        });
    }
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    const {id: __ , ...data} = updateProductDto;

    if(!updateProductDto || Object.keys(updateProductDto).length === 0){
      throw new BadRequestException('There is no data to update')
    }

    await this.findOne(id);

    return await this.prisma.product.update({where:{id}, data})
  }

  async remove(id: number) {

    await this.findOne(id);

    // return this.prisma.product.delete({where:{id}})

    const product = await this.prisma.product.update({
      where:{id}, 
      data: {
        available: false
      }
    });

    return product;

  }



  async validateProducts(ids: number[]){
    
    ids = Array.from(new Set(ids));

    const products = await this.prisma.product.findMany({
      where: {
        id:{
          in: ids
        }
      }
    });


    if(products.length != ids.length){
      throw new RpcException({
        message: 'Some products where not found',
        status: HttpStatus.BAD_REQUEST
      })
    };

    return products;
  }



}
