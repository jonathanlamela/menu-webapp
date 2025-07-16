import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"

import { CreateCategoryRequest, UpdateCategoryRequest, FindCategoryRequest, FindCategoryResponse, CreateCategoryResponse, GetCategoryResponse } from "shared/dtos/category";

import slugify from "slugify";
import path from "path";
import fs from "fs";
import { Category } from "shared/types";

export default class CategoryService {

    async create(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
        const db = await getDb();
        const documentCreated = await db.collection<Category>("categories").insertOne({
            name: data.name,
            deleted: false,
            slug: slugify(data.name, { lower: true })
        });

        if (documentCreated.acknowledged) {
            const _id = documentCreated.insertedId;

            if (data.image) {
                const imgFile = data.image;
                const buffer = Buffer.from(imgFile.buffer);
                const fileName = _id + "." + imgFile.originalname.split(".").at(1);
                const imagePath = `/assets/category/${fileName}`;
                const imageDir = path.join(process.cwd(), 'assets', 'category');
                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir);
                }
                fs.writeFileSync(path.join(imageDir, fileName), buffer);
                await db.collection<Category>("categories").updateOne(
                    { _id },
                    { $set: { imageUrl: imagePath } }
                );
            }

            return { id: _id, }; // tipizzato come CreateCategoryResponse
        } else {
            throw Error('unable to create category')
        }
    }

    async update(id: ObjectId, data: UpdateCategoryRequest) {
        const db = await getDb();
        const documentUpdated = await db.collection<Category>("categories").updateOne(
            { _id: id },
            {
                $set: {
                    name: data.name,
                    slug: slugify(data.name!, { lower: true })
                }
            }
        );

        if (documentUpdated.acknowledged) {
            if (data.image) {
                const imgFile = data.image;
                const buffer = Buffer.from(imgFile.buffer);
                const fileName = id + "." + imgFile.originalname.split(".").at(1);
                const imagePath = `/assets/category/${fileName}`;
                const imageDir = path.join(process.cwd(), 'assets', 'category');
                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir);
                }
                fs.writeFileSync(path.join(imageDir, fileName), buffer);
                await db.collection<Category>("categories").updateOne(
                    { _id: id },
                    { $set: { imageUrl: imagePath } }
                );
            }
        } else {
            throw Error('unable to update category')
        }
    }

    async delete(id: ObjectId) {
        const db = await getDb();
        await db.collection<Category>("categories").updateOne(
            { _id: id },
            { $set: { deleted: true } }
        );
    }

    async getById(id: ObjectId): Promise<GetCategoryResponse> {
        const db = await getDb();
        const category = await db.collection<Category>("categories").findOne({ _id: id });
        return { category }; // tipizzato come GetCategoryResponse
    }

    async find(params: FindCategoryRequest): Promise<FindCategoryResponse> {
        const db = await getDb();
        const collection = db.collection<Category>("categories");
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

        if (params.slug) {
            query.slug = params.slug;
        }

        if (!params.deleted) {
            query.deleted = false;
        }

        const count = await collection.countDocuments(query);

        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;
            let categories = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
            if (!params.deleted) {
                categories = categories.map(({ deleted, ...rest }) => rest);
            }
            const totalPages = Math.ceil(count / params.perPage!);
            const currentPage = params.page!;
            return {
                categories,
                count,
                page: currentPage,
                totalPages,
                params
            };
        } else {
            let categories = await collection.find(query).sort(sort).toArray();
            if (!params.deleted) {
                categories = categories.map(({ deleted, ...rest }) => rest);
            }
            return {
                categories,
                count,
                params,
            };
        }
    }
}
