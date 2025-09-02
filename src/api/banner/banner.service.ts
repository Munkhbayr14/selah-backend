import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

import getResourceUrl from 'libs/getResourceUrl';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';


@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) { }

  async bannerCreate(
    createBannerDto: CreateBannerDto,
    image?: Express.Multer.File,
  ) {
    if (!createBannerDto) {
      throw new BadRequestException('Мэдээлэл хоосон байна');
    }
    try {
      const bannerData = {
        title: createBannerDto.title,
        description: createBannerDto.description,
        image: image.filename,
      };
      const bannerUrl = await getResourceUrl(bannerData.image);
      bannerData.image = bannerUrl
      const bannerEntity = this.bannerRepository.create(bannerData);
      const bannerInfo = await this.bannerRepository.save(bannerEntity);
      return {
        statusCode: 201,
        status: ApiResponseStatusModel.SUCCESS,
        result: bannerInfo,
      };
    } catch (e) {
      console.error('Failed to create card:', e);
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to create card', error: e.message },
      };
    }
  }

  async bannerAll() {
    try {
      const bannerAll = await this.bannerRepository.find();
      bannerAll.map((banner) => {
        banner.image = `${process.env.RESOURCE_IMAGE_PREFIX}/banner-image/${banner.image}`
      })
      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: bannerAll,
      };
    } catch (error) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve banners', error: error.message },
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
