import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    lastname: string

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string
}
