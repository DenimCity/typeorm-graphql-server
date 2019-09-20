import { Resolver, Query, Mutation, Arg } from 'type-graphql';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi';
	}

	@Mutation(() => Boolean)
	register(@Arg('email') email: string, @Arg('password') password: string) {
		console.log('LOG: UserResolver -> register -> password', password);
		console.log('LOG: UserResolver -> email', email);
		return;
	}
}
