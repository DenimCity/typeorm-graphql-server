import { Resolver, Query, Mutation, Arg, Field, ObjectType, Ctx, UseMiddleware, Int } from 'type-graphql';
import { hash, compare } from 'bcrypt';
import {User} from '../entity/User';
import { Context } from '../interfaces';
import { generateToken, refreshToken, queryAuthorization, sendRefreshToken } from '../utils';
import { getConnection } from 'typeorm';

// import { validateRegisterInput } from 'src/utils';


@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
//   @Field(() => User)
//   user: User;
}
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
	async revokeRefreshtokenForUser(
		@Arg('userId', () => Int) userId: number
	){
		await getConnection()
		.getRepository(User)
		.increment({userId}, 'tokenVersion', 1)

		return true
	}


	@Mutation(() => LoginResponse)
	 async login(@Arg('email') email: string, @Arg("password") password: string,
	 @Ctx() {res}: Context
	 ) {
		 const user = await User.findOne({ where: {email }});

		 if(!user){
			 throw new Error("could not find user")
		 }

		 const valid = await compare(password, user.password)

		 if(!valid){
			 throw new Error('Invalid login credential')
		 }


		 sendRefreshToken( res, refreshToken(user))

		try {
			return {
			   accessToken: generateToken(user)
		}
		} catch (error) {
			throw new Error('Error Loggingin In')
		}

	 }

	@Mutation(() => Boolean)
	async register(@Arg('email') email: string, @Arg('password') password: string) {


		// const { valid, errors } = validateRegisterInput({ emailhjnm,,,,  password});

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


	@Query(() => String)
	@UseMiddleware(queryAuthorization)
	yo(
		@Ctx() {payload}: Context
	) {
		return ` your userID is ${payload!.userId}`
	}
}
