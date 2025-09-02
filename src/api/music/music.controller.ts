import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileTypesRegex, fileUploadOptions, imageUploadOptions, MP3UploadOptions } from 'config/FileUploadConfig';

@ApiTags('Music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'saffron', maxCount: 1 },
        { name: 'alto', maxCount: 1 },
        { name: 'tenor', maxCount: 1 },
        { name: 'bass', maxCount: 1 },
      ],
      fileUploadOptions(FileTypesRegex.ALL, 'file'),
    ),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        musicUrl: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        saffron: { type: 'string', format: 'binary' },
        alto: { type: 'string', format: 'binary' },
        tenor: { type: 'string', format: 'binary' },
        bass: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @Body() createMusicDto: CreateMusicDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[],
      saffron?: Express.Multer.File[],
      alto?: Express.Multer.File[],
      tenor?: Express.Multer.File[],
      bass?: Express.Multer.File[],
    },
  ) {
    const fileData = {
      file: files.file?.[0] ?? null,
      saffron: files.saffron?.[0] ?? null,
      alto: files.alto?.[0] ?? null,
      tenor: files.tenor?.[0] ?? null,
      bass: files.bass?.[0] ?? null,
    };
    return this.musicService.createMusic(createMusicDto, fileData);
  }

  @Get("/all")
  musicAll() {
    return this.musicService.musicAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
