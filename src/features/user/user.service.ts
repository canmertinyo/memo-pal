import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { RegisterDto, RefreshTokenDto } from '../auth/dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async createUser(registerDto: RegisterDto): Promise<UserDocument> {
    return await new this.userModel(registerDto).save();
  }

  public async findById(
    userId: string | Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userModel.findById({ _id: userId });
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  public findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  public async findByUsernameAndEmail(
    email: string,
    username: string,
  ): Promise<UserDocument[]> {
    return await this.userModel.find({ $or: [{ email }, { username }] });
  }

  public async updateRefreshToken(
    id: string | Types.ObjectId,
    updateDto: RefreshTokenDto,
  ): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  //C.....
  public async addNoteToUser(
    userId: string | Types.ObjectId,
    newNoteId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: userId },
      { $push: { notes: newNoteId } },
    );
  }

  public async deleteItemFromArray(
    userId: string,
    noteId: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: userId },
      { $pull: { notes: noteId } },
    );
  }

  public async loggedUser(id: string) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('No user found');

    return user;
  }
}
