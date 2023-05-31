import { IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  tax_code: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  reperesent_person: string;

  description?: string = null;
  slogan?: string = null;
  detail_address?: string = null;
  root_id?: string = null;
}
