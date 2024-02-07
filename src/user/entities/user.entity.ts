import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ comment: '用户名称' })
    userName: string;
    
    @Column({ comment: '用户昵称' })
    nickName: string;

    @Column({ comment: '手机号' })
    phoneNumber: string;

    @Column({ comment: '邮箱' })
    email: string;

    @Column({ comment: '头像', nullable: true })
    avatar?: string;

    @Column({ comment: '性别(0:女,1:男)', nullable: true })
    sex?: number

    @Column({ comment: '密码' })
    @Exclude()
    password: string;

    @CreateDateColumn()
    createTime?: Date;

    @UpdateDateColumn()
    updateTime?: Date;

}
