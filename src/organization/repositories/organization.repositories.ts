import { Injectable } from '@nestjs/common';
import {
  Neo4jModelService,
  Neo4jNodeModelService,
  Neo4jService,
  int,
} from 'src/neo4j-database';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import {
  ORGANIZATION_LABEL,
  ROOT_ORGANIZATION_LABEL,
} from '../constant/organization.constant';
import { Organization } from '../entity/organization.entity';

@Injectable()
export class OrganizationRepository extends Neo4jModelService<Organization> {
  constructor(protected readonly neo4jNodeService: Neo4jService) {
    super();
  }

  label = ORGANIZATION_LABEL;
  logger = undefined;
  timestamp = 'created_at';

  fromNeo4j(model: Record<string, any>): Organization {
    return super.fromNeo4j({
      ...model,
      age: model.age.toNumber(),
    });
  }

  toNeo4j(cat: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = { ...cat };

    if (!isNaN(result.age)) {
      result.age = int(result.age);
    }

    return super.toNeo4j(result);
  }
}
