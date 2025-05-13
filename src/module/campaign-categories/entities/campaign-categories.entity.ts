import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'campaign_categories' })
export class CampaignCategoriesEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'category_name' })
    category_name!: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}

