import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
  modelName: 'User',
  paranoid: true,
})
export default class User extends Model<User> {
  @Column
  firstname: string;

  @Column
  lastname: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  isVendor: boolean;
}
