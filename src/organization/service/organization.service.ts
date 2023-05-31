import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j-database';
import { Organization } from '../entity/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationRepository } from '../repositories/organization.repositories';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepositories: OrganizationRepository,
  ) {}

  async createOrganization(organization: CreateOrganizationDto) {
    const { tax_code, root_id } = organization;

    const organizations = await this.organizationRepositories.findByProperties(
      'tax_code',
      tax_code,
    );
  }
}
