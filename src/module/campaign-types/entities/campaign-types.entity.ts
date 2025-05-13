import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'campaign_types' })
export class CampaignTypesEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'type_name' })
    type_name!: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}


