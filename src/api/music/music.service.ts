import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import getResourceUrl from 'libs/getResourceUrl';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';
import { Music } from './entities/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MusicService {
  private readonly folderUrl = 'file';
  private readonly fileKeys = ['file', 'saffron', 'alto', 'tenor', 'bass'] as const;

  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {
    if (!process.env.RESOURCE_IMAGE_PREFIX) {
      throw new Error('RESOURCE_IMAGE_PREFIX is not set');
    }
  }

  private buildFileUrl(filename: string | null): string | null {
    if (!filename) return null;
    return `${process.env.RESOURCE_IMAGE_PREFIX}/${this.folderUrl}/${filename}`;
  }

  async createMusic(
    createMusicDto: CreateMusicDto,
    files: {
      file?: Express.Multer.File;
      saffron?: Express.Multer.File;
      alto?: Express.Multer.File;
      tenor?: Express.Multer.File;
      bass?: Express.Multer.File;
    },
  ) {
    try {
      const musicAllData: any = {
        musicUrl: createMusicDto.musicUrl,
        title: createMusicDto.title,
      };

      for (const key of this.fileKeys) {
        musicAllData[key] = files[key]?.filename ?? null;
      }

      for (const key of this.fileKeys) {
        if (musicAllData[key]) {
          musicAllData[key] = await getResourceUrl(musicAllData[key]);
        }
      }

      const musicEntity = this.musicRepository.create(musicAllData);
      const savedMusic = await this.musicRepository.save(musicEntity);

      return {
        statusCode: 201,
        status: ApiResponseStatusModel.SUCCESS,
        result: savedMusic,
      };
    } catch (e) {
      console.error('Failed to create music:', e);
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to create music', error: e.message },
      };
    }
  }

  async musicAll() {
    try {
      const fetchMusic = await this.musicRepository.find();
      const mappedMusic = fetchMusic.map((music) => {
        const mapped: any = { ...music };
        for (const key of this.fileKeys) {
          mapped[key] = this.buildFileUrl(music[key]);
        }
        return mapped;
      });

      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: mappedMusic,
      };
    } catch (e) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve music', error: e.message },
      };
    }
  }

  async findOne(id: number) {
    try {
      const music = await this.musicRepository.findOne({ where: { id } });
      if (!music) {
        return {
          statusCode: 404,
          status: ApiResponseStatusModel.FAILED,
          result: { message: 'Магтан дуу байхгүй байна' },
        };
      }

      const audio = this.fileKeys
        .filter((key) => key !== 'file' && music[key])
        .map((key) => ({
          voice: key,
          url: this.buildFileUrl(music[key]),
        }));

      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: {
          ...music,
          file: this.buildFileUrl(music.file),
          audio,
        },
      };
    } catch (e) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve music', error: e.message },
      };
    }
  }

  async update(id: number, dto: UpdateMusicDto) {
    await this.musicRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.musicRepository.delete(id);
    return {
      statusCode: 200,
      status: ApiResponseStatusModel.SUCCESS,
      result: { message: 'Music deleted successfully' },
    };
  }
}
