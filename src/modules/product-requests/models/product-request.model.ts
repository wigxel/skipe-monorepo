import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'product_requests',
  timestamps: true,
  underscored: true,
  modelName: 'ProductRequest',
})
export default class ProductRequest extends Model<ProductRequest> {
  @Column
  description: string;

  @Column
  imageUrl: string;

  @Column
  userId: string;
}
