import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  // Use Column decorator to store in the database
  @Field(() => ID) // I use Field() decorator to expose this to graphql. It means that we set id, firstName, lastName and email are graphql field but password is a database field
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
}
