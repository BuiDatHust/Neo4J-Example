import { Injectable } from '@nestjs/common';
import {
  Neo4jNodeRelationshipModelService,
  Neo4jService,
} from 'src/neo4j-database';
import {
  ORGANIZATION_LABEL,
  ROOT_ORGANIZATION_LABEL,
} from '../constant/organization.constant';
import { Organization } from '../entity/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';

@Injectable()
export class OrganizationRepository extends Neo4jNodeRelationshipModelService<Organization> {
  constructor(
    protected readonly neo4jNodeService: Neo4jService,
    protected readonly neo4jService: Neo4jService,
  ) {
    super();
  }

  label = ORGANIZATION_LABEL;
  logger = undefined;
  timestamp = 'created_at';

  async findByTaxCode(
    tax_code: string,
    stringoptions?: {
      skip?: number;
      limit?: number;
      orderBy?: string;
      descending?: boolean;
    },
  ) {
    const properties = { tax_code } as Partial<Organization>;
    const queryCypher = await super.findNodeBy(properties, stringoptions);
    return queryCypher.run();
  }

  async createNodeOrg(properties, lbl: string) {
    this.label = lbl;
    const queryCypher = await super.createNode(properties);
    return queryCypher.run();
  }

  // async deleteNodeWithRelationship() {}

  // async createRelationOrgWithOrg() {}

  // async updateRelationOrgWithOrg() {}

  // async deleteRelationOrgWithOrg() {}
}
