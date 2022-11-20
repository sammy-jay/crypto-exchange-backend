import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;
}

export default User;
