import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationRepository } from '../repositories/organization.repositories';
import { ROOT_ORGANIZATION_LABEL } from '../constant/organization.constant';
import { Organization } from '../entity/organization.entity';
import { ORGANIZATION_LABEL } from '../constant/organization.constant';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepositories: OrganizationRepository,
  ) {}

  async createOrganization(organization: CreateOrganizationDto) {
    const { tax_code, root_id } = organization;

    const organizations = await this.organizationRepositories.findByTaxCode(
      tax_code,
    );

    if (organizations.length) {
      return this.organizationRepositories.createNodeOrg(
        organization,
        ORGANIZATION_LABEL,
      );
      // await this.organizationRepositories.createRelationship()
    } else {
      return this.organizationRepositories.createNodeOrg(
        organization,
        ROOT_ORGANIZATION_LABEL,
      );
    }
  }
}
