import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn() userId: number;
	
	@Field()
	@Column() email: string;

	@Column() password: string;
}
