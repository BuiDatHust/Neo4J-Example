import { Controller, Post, Request } from '@nestjs/common';
import { OrganizationService } from './service/organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('/')
  public async create(@Request() req) {
    const result = await this.organizationService.createOrganization(req.body);
    return result;
  }
}
