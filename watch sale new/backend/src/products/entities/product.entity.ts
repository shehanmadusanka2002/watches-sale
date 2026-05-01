import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
// import { Review } from '../../reviews/entities/review.entity';

@Entity('products')
@Index('idx_product_name', ['name'])
@Index('idx_product_brand', ['brand'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ nullable: true })
  movementType: string;

  @Column({ nullable: true })
  caseMaterial: string;

  @Column({ nullable: true })
  waterResistance: string;

  @Column({ nullable: true })
  warranty: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('longtext', { nullable: true })
  imageUrl: string;

  @Column('int', { default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  categoryType: string;

  @ManyToOne(() => Category, category => category.products, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // @OneToMany(() => Review, review => review.product, { cascade: true })
  // reviews: Review[];
}
