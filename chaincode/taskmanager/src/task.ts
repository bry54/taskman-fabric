import { Object, Property } from 'fabric-contract-api';

@Object()
export class Task {

    @Property()
    public id: string;

    @Property()
    public title: string;

    @Property()
    public description: string;

    @Property()
    public status: string;

    @Property()
    public createdAt: string;

    @Property()
    public updatedAt: string;

    @Property()
    public deletedAt: string;

}