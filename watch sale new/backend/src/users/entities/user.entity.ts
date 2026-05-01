import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { Role } from '../../enums/role.enum';

@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })
export class User {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'int',
    default: 1,
    transformer: {
      to: (value: Role) => (value === Role.ADMIN ? 0 : 1),
      from: (value: number) => (Number(value) === 0 ? Role.ADMIN : Role.CUSTOMER),
    },
  })
  role: Role;

  // Relations (to be added as other entities are created)
  // @OneToMany(() => Order, order => order.user)
  // orders: Order[];

  // @OneToMany(() => Review, review => review.user)
  // reviews: Review[];

  // @OneToOne(() => ShoppingCart, cart => cart.user)
  // shoppingCart: ShoppingCart;
}
