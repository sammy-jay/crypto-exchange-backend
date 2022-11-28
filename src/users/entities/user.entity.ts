import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enum/role.enum';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  public username: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public phoneNumber: string;

  // @Column({
  //   type: 'enum',
  //   enum: Role,
  //   default: Role.User,
  // })
  // public role: Role;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;
}

export default User;
