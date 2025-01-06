import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";
import { Author } from "./Author";
import { Album } from "./Album";

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

  @OneToOne(() => PhotoMetadata, (photoMetaData) => photoMetaData.photo, {
    cascade: true,
  })
  metadata!: Relation<PhotoMetadata>;

  @ManyToOne(() => Author, (author) => author.photos)
  author!: Author;

  @ManyToMany(() => Album, (album) => album.photos)
  albums!: Album[];
}
