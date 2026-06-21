import { IsString, MinLength } from 'class-validator';

export class GeneratePlanDto {
  @IsString()
  @MinLength(10)
  story: string;
}