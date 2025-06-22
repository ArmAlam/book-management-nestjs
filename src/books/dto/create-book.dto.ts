import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsISBN,
  IsInt,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
