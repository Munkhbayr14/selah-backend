import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypesRegex, imageUploadOptions } from 'config/FileUploadConfig';

@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions(FileTypesRegex.IMAGE, 'banner-image')))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  async bannerImage(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() image: Express.Multer.File) {
    console.log('Uploaded file:', image);
    if (!image) {
      throw new BadRequestException('Файл хүлээн авсангүй!');
    }
    return this.bannerService.bannerCreate(createBannerDto, image);
  }

  @Get("/all")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT')
  bannerAll() {
    return this.bannerService.bannerAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(+id, updateBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
function uuidv4() {
  throw new Error('Function not implemented.');
}
