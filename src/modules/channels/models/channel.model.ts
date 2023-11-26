import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';
import UserChannel from './user-channel.model';
import User from '../../accounts/models/user.model';
import slugify from 'sequelize-slugify';

@Table({
  tableName: 'channels',
  timestamps: true,
  underscored: true,
  modelName: 'Channel',
  paranoid: true,
})
export default class Channel extends Model<Channel> {
  @Column
  name: string;

  @Column
  slug: string;

  @BelongsToMany(() => User, () => UserChannel, 'channelId', 'userId')
  subscribers: User[];

  // Add this constructor to initialize slugify
  constructor(values?: any, options?: any) {
    super(values, options);
    slugify.slugifyModel(this, {
      source: ['name'],
      slugOptions: { lower: true },
      overwrite: false,
      column: 'slug',
      incrementalSeparator: '-',
    } as any);
  }
}
