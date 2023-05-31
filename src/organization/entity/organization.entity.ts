import { Node } from 'neo4j-driver';

export class Organization {
  constructor(private readonly organization: Node) {}

  toJson(): Record<string, any> {
    return {
      ...this.organization.properties,
    };
  }
}
