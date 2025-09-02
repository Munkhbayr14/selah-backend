import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import getResourceUrl from 'libs/getResourceUrl';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>

  ) { }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findAll() {
  }

  async profileData(id: number) {
    const folderUrl = "avatarUrl"
    const profileData = await this.profileRepository.findOne({
      where: { userId: id },
    });
    if (!profileData) {
      throw new NotFoundException(`${id}-тай хэрэглэгчийн profile олдсонгүй`);
    }
    const updatedProfileData = {
      ...profileData,
      avatarUrl: profileData.avatarUrl != null && profileData.avatarUrl != ""
        ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${profileData.avatarUrl}`
        : "",
    };
    return {
      statusCode: 200,
      status: ApiResponseStatusModel.SUCCESS,
      result: updatedProfileData,
    };
  }

  async updateProfile(
    id: number,
    createProfileDto: CreateProfileDto,
    avatarUrl?: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id }
      });
      if (!user) {
        throw new NotFoundException(`${id}-тай хэрэглэгч олдсонгүй`);
      }

      const existProfile = await this.profileRepository.findOne({
        where: {
          userId: id
        }
      });
      if (!existProfile) {
        throw new NotFoundException(`${id}-тай хэрэглэгчийн profile олдсонгүй`);
      }

      const profileData: any = {
        lastName: createProfileDto.lastname,
        firstName: createProfileDto.firstname,
        email: createProfileDto.email,
      };
      const UserData: any = {
        lastName: createProfileDto.lastname,
        firstName: createProfileDto.firstname,
        email: createProfileDto.email
      };
      if (avatarUrl) {
        const avatarData = await getResourceUrl(avatarUrl.filename);
        console.log('Generated Avatar URL:', avatarData);
        profileData.avatarUrl = avatarData;
      }
      await this.dataSource.transaction(async (manager) => {
        const updatedUser = await manager.getRepository(User).update(
          { id },
          UserData,
        );

        const updatedProfile = await manager.getRepository(Profile).update(
          { userId: id },
          profileData,
        );

        return {
          statusCode: 200,
          status: ApiResponseStatusModel.SUCCESS,
          message: "Таны мэдээлэл амжилттай солигдлоо",
          result: updatedProfile,
        };
      });
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to update profile', error: e.message },
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
