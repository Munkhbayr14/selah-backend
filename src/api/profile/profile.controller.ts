import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypesRegex, imageUploadOptions } from 'config/FileUploadConfig';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatarUrl', imageUploadOptions(FileTypesRegex.IMAGE, 'avatarUrl')))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatarUrl: {
          type: 'string',
          format: 'binary',
        },
        // title: { type: 'string' },
        // description: { type: 'string' },
      },
    }
  })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.profileData(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatarUrl', imageUploadOptions(FileTypesRegex.IMAGE, 'avatarUrl')))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lastname: { type: 'string' },
        firstname: { type: 'string' },
        email: { type: 'string' },
        avatarUrl: {
          type: 'string',
          format: 'binary',
        },

      },
    }
  })
  update(@Param('id') id: string,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() avatarUrl: Express.Multer.File
  ) {

    return this.profileService.updateProfile(+id, createProfileDto, avatarUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
