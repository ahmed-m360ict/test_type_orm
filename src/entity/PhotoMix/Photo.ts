import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column("text")
  description!: string;

  @Column()
  filename!: string;

  @Column("integer")
  views!: number;

  @Column("numeric", { precision: 1, scale: 2, nullable: true })
  rating!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ default: new Date(), update: false })
  created_at!: Date;

  @Column({ nullable: true })
  updated_at!: Date;
}
