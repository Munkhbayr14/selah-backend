import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string;

}
