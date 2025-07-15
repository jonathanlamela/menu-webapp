import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"
import { Carrier } from "shared/types";

import { CreateCarrierRequest, CreateCarrierResponse, FindCarrierRequest, FindCarrierResponse, GetCarrierByIdResponse, UpdateCarrierRequest } from "shared/dtos/carrier";

export default class CarrierService {

    async create(data: CreateCarrierRequest): Promise<CreateCarrierResponse> {
        const db = await getDb();
        const documentCreated = await db.collection<Carrier>("carriers").insertOne({
            name: data.name,
            deleted: false,
            costs: data.costs
        });



        if (documentCreated.acknowledged) {
            const _id = documentCreated.insertedId;
            return { id: _id } as CreateCarrierResponse;
        } else {
            throw Error('unable to create carrier');
        }
    }

    async update(id: ObjectId, data: UpdateCarrierRequest) {
        const db = await getDb();
        // Costruisci dinamicamente i campi da aggiornare solo se non sono nulli
        const updateFields: Partial<Carrier> = {};
        if (data.name !== null && data.name !== undefined) {
            updateFields.name = data.name;
        }
        if (data.costs !== null && data.costs !== undefined) {
            updateFields.costs = data.costs;
        }

        const documentUpdated = await db.collection<Carrier>("carriers").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!documentUpdated.acknowledged || documentUpdated.modifiedCount === 0) {
            throw Error('unable to update carrier');
        }
    }

    async delete(id: ObjectId) {
        const db = await getDb();
        await db.collection<Carrier>("carriers").updateOne(
            { _id: id },
            { $set: { deleted: true } }
        );
    }

    async getById(id: ObjectId): Promise<GetCarrierByIdResponse> {
        const db = await getDb();
        const carrier = await db.collection<Carrier>("carriers").findOne({ _id: id });
        return { carrier } as GetCarrierByIdResponse;
    }

    async find(params: FindCarrierRequest): Promise<FindCarrierResponse> {
        const db = await getDb();
        const collection = db.collection<Carrier>("carriers");
        const sort: any = {};

        if (params.orderBy === "id") {
            sort._id = params.ascending ? 1 : -1;
        } else if (params.orderBy === "name") {
            sort.name = params.ascending ? 1 : -1;
        }

        const query: any = {};

        if (params.search && params.search !== "") {
            query.name = { $regex: params.search, $options: "i" };
        }

        if (!params.deleted) {
            query.deleted = false;
        }

        const count = await collection.countDocuments(query);

        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;
            let carriers = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
            if (!params.deleted) {
                carriers = carriers.map(({ deleted, ...rest }) => rest);
            }
            const totalPages = Math.ceil(count / params.perPage!);
            const currentPage = params.page!;
            return {
                carriers,
                count,
                page: currentPage,
                totalPages,
                params,

            } as FindCarrierResponse;
        } else {
            let carriers = await collection.find(query).sort(sort).toArray();
            if (!params.deleted) {
                carriers = carriers.map(({ deleted, ...rest }) => rest);
            }
            return {
                carriers,
                count,
                params,

            } as FindCarrierResponse;
        }
    }
}

