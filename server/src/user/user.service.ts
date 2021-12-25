import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import Ctx from '../types/context.type';
import { User, UserDocument, CreateUserInput, ConfirmUserInput, LoginInput } from './user.schema';
import { signJwt } from 'src/utils/jwt.utils';
import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
  domain: 'localhost', // <-- Change to your client domain
  secure: false, // Should be true if not development
  sameSite: 'strict',
  httpOnly: true,
  path: '/'
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: any) {
    return this.userModel.findById(id).lean();
  }

  async createUser(input: CreateUserInput) {
    const confirmToken = nanoid(32);
    return this.userModel.create({ ...input, confirmToken });
    // try {
    //   return this.userModel.create({ ...input, confirmToken });
    // } catch (err) {
    //   console.log(`Create User Err: `, err);
    //   return new Error('Email is always existed');
    // }
  }

  async confirmUser({ email, confirmToken }: ConfirmUserInput) {
    // find our user
    const user = await this.userModel.findOne({ email });
    // Check if the user exists
    // Check if the confirmation token === confirmToken
    if (!user || confirmToken !== user.confirmToken) {
      throw new Error('Email or confirm token is incorrect!');
    }

    // chang active to true
    user.active = true;

    // save the user
    await user.save();

    // return the user
    return user;
  }

  async login({ email, password }: LoginInput, context: Ctx) {
    // Find our user and remove __v and confirmToken
    const user = await this.userModel.findOne({ email }).select('-__v -confirmToken');

    // Check that user exists
    // Compare input password with the user's hashed password
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    // Check that the user is active
    if (!user.active) {
      throw new Error('Please confirm your email address');
    }

    // Create a JWT Token
    const jwt = signJwt(omit(user.toJSON(), ['password', 'active']));

    // Set the JWT in a cookie
    context.res.cookie('token', jwt, cookieOptions);
    console.log(`Checking User`, JSON.stringify(user)); // return the user
    // console.log(`Checking JWT`, JSON.stringify(jwt));
    return user;
  }

  async logout(context) {
    context.res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
    return null;
  }
}
