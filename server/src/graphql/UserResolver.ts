import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { hash } from 'bcrypt';
import {User} from '../entity/User';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi';
	}
	@Query(() => [User])
	users(){
		return User.find()
	}

	@Mutation(() => Boolean)
	async register(@Arg('email') email: string, @Arg('password') password: string) {
		const hashPassword = await hash(password, 12)
		try {
			User.insert({
				email,
				password: hashPassword
			})
			return true
		} catch (error) {
			return false;
		}
	}
}
