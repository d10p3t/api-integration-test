export type EntityType = "User" | "Post";

export interface Entity {
  id: string;
  type: EntityType;
  data: any;
}

export type RelationshipType = "HAS";

export interface Relationship {
  from: string;
  to: string;
  type: RelationshipType;
}

export class Graph {
  graph: {
    entities: {
      [id: string]: Entity
    };
    relationships: Relationship[]
  } = {
    entities: {},
    relationships: []
  };

  createEntity(id: string, type: EntityType, data: any): Entity {
    const entity = {
      id,
      type,
      data,
    };

    this.graph.entities[id] = entity;

    return entity;
  }

  findEntityById(id: string): Entity | null {
    return this.graph.entities[id] || null;
  }

  createRelationship(from: Entity, to: Entity, type: RelationshipType): Relationship {
    if (!this.findEntityById(from.id)) {
      throw new Error(`Could not find (from) entity from graph with id: ${from.id}`);
    }

    if (!this.findEntityById(to.id)) {
      throw new Error(`Could not find (to) entity from graph with id: ${to.id}`);
    }

    const relationship = {
      from: from.id,
      to: to.id,
      type
    };


    this.graph.relationships.push(relationship);

    return relationship;
  }

  listRelationships(): Relationship[] {
    return this.graph.relationships;
  }
}