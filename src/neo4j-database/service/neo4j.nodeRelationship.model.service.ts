import { Neo4jModelService } from './neo4j.model.service';
import {
  neo4jSkipLimit,
  NODE,
  ORDER_BY,
  RETURN_PROPERTIES,
  SKIP_LIMIT,
  TIMESTAMP,
} from '../common';
import { Transaction } from 'neo4j-driver';
import { Query } from '../interface';

/**
 * Helper class to generate Node model service using Neo4j
 */
export abstract class Neo4jNodeRelationshipModelService<
  T,
> extends Neo4jModelService<T> {
  createRelationship<F, R>(
    props: Partial<T>,
    fromProps: Partial<F>,
    toProps: Partial<R>,
    fromService: Neo4jNodeRelationshipModelService<F>,
    toService: Neo4jNodeRelationshipModelService<R>,
    options: { merge?: boolean; returns?: boolean } = {
      merge: false,
      returns: true,
    },
  ) {
    const p = this.toNeo4j(props);
    const fp = fromService.toNeo4j(fromProps);
    const tp = toService.toNeo4j(toProps);

    const MATCH = `MATCH ${NODE('f', fromService.label)}, ${NODE(
      't',
      toService.label,
    )}`;

    const WHERE_CLAUSES = [
      ...Object.keys(fp).map((k) => `f.\`${k}\` = $fp.\`${k}\``),
      ...Object.keys(tp).map((k) => `t.\`${k}\` = $tp.\`${k}\``),
    ].join(' AND ');

    const WHERE = `${WHERE_CLAUSES ? ` WHERE ${WHERE_CLAUSES}` : ''}`;

    const CREATE = `${options?.merge ? ' MERGE' : ' CREATE'} (f)-[r:\`${
      this.label
    }\`]->(t)`;

    const SET = `${p || this.timestamp ? ` SET` : ''}${
      p ? ` r=$p` : ''
    }${TIMESTAMP('r', this.timestamp, p ? ', ' : ' ')}`;

    const RETURN = `${
      options.returns
        ? ` RETURN properties (f) AS from, properties(r) AS created, properties(t) AS to`
        : ''
    }`;

    const query = {
      cypher: `${MATCH}${WHERE}${CREATE}${SET}${RETURN}`,
      parameters: { p, fp, tp },
    };
    return {
      query,
      runTx: (tx: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query, { write: true });
        return res.map((r) => {
          return [
            fromService.fromNeo4j(r.from),
            this.fromNeo4j(r.merged),
            toService.fromNeo4j(r.to),
          ] as [F, T, R];
        });
      },
    };
  }

  createNode(
    properties: Partial<T>,
    options: { returns?: boolean } = {
      returns: true,
    },
  ) {
    const props = this.toNeo4j(properties);

    const CREATE = `CREATE ${NODE('n', this.label)}`;
    const SET = ` SET n=$props${
      props[this.timestamp] ? '' : TIMESTAMP('n', this.timestamp, ', ')
    }`;
    const RETURN = options?.returns ? RETURN_PROPERTIES('n', 'created') : ``;

    const query: Query<T> = {
      cypher: `${CREATE}${SET}${RETURN}`,
      parameters: { props },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query, { write: true });
        return res.map((r) => {
          return this.fromNeo4j(r.created);
        })[0];
      },
    };
  }

  mergeNode(
    properties: Partial<T>,
    options: { returns?: boolean } = {
      returns: true,
    },
  ) {
    const props = this.toNeo4j(properties);

    const MERGE = `MERGE ${NODE('n', this.label, { props })}`;
    const SET = `${TIMESTAMP('n', this.timestamp, ' ON CREATE SET ')}`;
    const RETURN = options?.returns ? RETURN_PROPERTIES('n', 'merged') : ``;

    const query = {
      cypher: `${MERGE}${SET}${RETURN}`,
      parameters: { props },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query, { write: true });
        return res.map((r) => {
          return this.fromNeo4j(r.merged);
        });
      },
    };
  }

  updateNode(
    match: Partial<T>,
    update: Partial<T>,
    options: { mutate?: boolean; returns?: boolean } = {
      mutate: true,
      returns: true,
    },
  ) {
    const props = this.toNeo4j(match);
    const updates = this.toNeo4j(update);

    const MATCH = `MATCH ${NODE('n', this.label, { props })}`;
    const SET = ` SET n ${options?.mutate ? '+' : ''}= $updates`;
    const RETURN = options?.returns ? RETURN_PROPERTIES('n', 'updated') : ``;

    const query = {
      cypher: `${MATCH}${SET}${RETURN}`,
      parameters: { props, updates },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query, { write: true });
        return res.map((r) => {
          return this.fromNeo4j(r.updated);
        });
      },
    };
  }

  deleteNode(
    properties: Partial<T>,
    options: { returns?: boolean } = {
      returns: true,
    },
  ) {
    const props = this.toNeo4j(properties);

    const MATCH = `MATCH ${NODE('n', this.label, { props })}`;
    const WITH = options?.returns
      ? ` WITH n, properties(n) AS \`deleted\``
      : ``;
    const DELETE = ` DELETE n`;
    const RET = options?.returns ? ` RETURN \`deleted\`` : ``;

    const query = {
      cypher: `${MATCH}${WITH}${DELETE}${RET}`,
      parameters: { props },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query, { write: true });
        return res.map((r) => {
          return this.fromNeo4j(r.deleted);
        });
      },
    };
  }

  findAllNode(
    options: {
      skip?: number;
      limit?: number;
      orderBy?: string;
      descending?: boolean;
    } = {
      skip: 0,
      limit: 100,
    },
  ) {
    const MATCH = `MATCH ${NODE('n', this.label)}`;
    const RETURN = ` RETURN properties(n) AS \`matched\``;

    const query = {
      cypher: `${MATCH}${RETURN}${ORDER_BY(
        'n',
        options?.orderBy,
        options?.descending,
      )}${SKIP_LIMIT(options)}`,
      parameters: neo4jSkipLimit(options),
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query);
        return res.map((r) => {
          return this.fromNeo4j(r.matched);
        });
      },
    };
  }

  findNodeBy(
    properties: Partial<T>,
    options: {
      skip?: number;
      limit?: number;
      orderBy?: string;
      descending?: boolean;
    } = {
      skip: 0,
      limit: 100,
    },
  ) {
    const props = this.toNeo4j(properties);

    const MATCH = `MATCH ${NODE('n', this.label, { props })}`;
    const RETURN = ` RETURN properties(\`n\`) AS \`matched\``;

    const query = {
      cypher: `${MATCH}${RETURN}${ORDER_BY(
        'n',
        options?.orderBy,
        options?.descending,
      )}${SKIP_LIMIT(props)}`,
      parameters: { props, ...neo4jSkipLimit(options) },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query);
        return res.map((r) => {
          return this.fromNeo4j(r.matched);
        });
      },
    };
  }

  searchNodeBy(
    prop: keyof T,
    search: string,
    options: {
      skip?: number;
      limit?: number;
    } = {
      skip: 0,
      limit: 100,
    },
  ) {
    const terms = search.replace(/\s+/g, ' ').trim().split(' ');

    const MATCH = `MATCH ${NODE('n', this.label)}`;
    const WITH = ` WITH n, split(n.\`${String(prop)}\`, ' ') as words`;

    const query = {
      cypher: `${MATCH}${WITH}
    WHERE ANY (term IN $terms WHERE ANY(word IN words WHERE word CONTAINS term))
    WITH n, words, 
    CASE WHEN apoc.text.join($terms, '') = apoc.text.join(words, '') THEN 100
    ELSE reduce(s = 0, st IN $terms | s + reduce(s2 = 0, w IN words | CASE WHEN (w = st) THEN (s2 + 4) ELSE CASE WHEN (w CONTAINS st) THEN (s2 +2) ELSE (s2) END END)) END AS score 
    ORDER BY score DESC${SKIP_LIMIT(
      options,
    )} RETURN properties(n) as \`matched\`, score`,
      parameters: {
        terms: terms,
        ...neo4jSkipLimit(options),
      },
    };

    return {
      query,
      runTx: (tx?: Transaction) => tx.run(query.cypher, query.parameters),
      run: async () => {
        const res = await this._run(query);
        return res.map(
          (r) => <[T, number]>[this.fromNeo4j(r.matched), Number(r.score)],
        );
      },
    };
  }
}
