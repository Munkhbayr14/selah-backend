import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class CreateMusicDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @Matches(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/, {
        message: 'Зөвхөн YouTube линк оруулна уу эсвэл хоосон орхино уу',
    })
    musicUrl?: string;

}
