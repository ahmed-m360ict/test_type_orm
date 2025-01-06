import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class PhotoMetadata {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  height!: number;

  @Column("int")
  width!: number;

  @Column("enum", { enum: ["portrait", "landscape"] })
  orientation!: string;

  @Column({ default: false })
  compressed!: boolean;

  @Column({ nullable: true })
  comment!: string;

  @OneToOne(() => Photo, (photo) => photo.metadata, { onDelete: "CASCADE" })
  @JoinColumn()
  photo!: Relation<Photo>;
}
