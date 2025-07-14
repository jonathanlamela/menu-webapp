import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"

import type { CreateCategoryRequest, FindCategoryRequest, UpdateCategoryRequest } from "@shared/dtos"
import slugify from "slugify";
import { Category } from "@shared/types";
import path from "path";
import fs from "fs";

export default class CategoryService {

    async createCategory(data: CreateCategoryRequest): Promise<ObjectId> {

        //Get db connection
        const db = await getDb();

        //Create the category
        const documentCreated = await db.collection<Category>("categories").insertOne({
            name: data.name,
            deleted: false,
            slug: slugify(data.name, {
                lower: true
            })
        });

        //Check if creation it was done
        if (documentCreated.acknowledged) {

            var _id = documentCreated.insertedId;

            //If there is a iamge
            if (data.image) {
                var imgFile = data.image;

                //Create buffer from image file
                const buffer = Buffer.from(await imgFile.buffer);

                //Create file name
                var fileName = _id + "." + imgFile.originalname.split(".").at(1);

                //Create public path
                var imagePath = `/assets/category/${fileName}`;

                var imageDir = path.join(process.cwd(), 'assets', 'category');

                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir);
                }

                //Write file to filesystem
                await fs.writeFileSync(path.join(imageDir, fileName), buffer);

                //Update db with imageUrl
                await db.collection<Category>("categories").updateOne({
                    _id: _id,
                }, {
                    $set: {
                        imageUrl: imagePath
                    }
                })
            }

            return _id;
        } else {
            throw Error('unable to create category')
        }

    }

    async updateCategory(id: ObjectId, data: UpdateCategoryRequest) {

        //Get db connection
        const db = await getDb();

        //Update the category
        const documentUpdated = await db.collection<Category>("categories").updateOne({
            _id: id
        }, {
            $set: {
                name: data.name,
                slug: slugify(data.name, {
                    lower: true
                })
            }
        });

        if (documentUpdated.acknowledged) {
            ///If there is a iamge
            if (data.image) {
                var imgFile = data.image;

                //Create buffer from image file
                const buffer = Buffer.from(await imgFile.buffer);

                //Create file name
                var fileName = id + "." + imgFile.originalname.split(".").at(1);

                //Create public path
                var imagePath = `/assets/category/${fileName}`;

                //Calc the page directory path
                var imageDir = path.join(process.cwd(), 'assets', 'category');

                //Create if not exists
                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir);
                }

                //Write file to filesystem
                await fs.writeFileSync(path.join(imageDir, fileName), buffer);

                //Update db with imageUrl
                await db.collection<Category>("categories").updateOne({
                    _id: id,
                }, {
                    $set: {
                        imageUrl: imagePath
                    }
                })
            }
        } else {
            throw Error('unable to update category')
        }
    }

    async deleteCategory(id: ObjectId) {

        //Get db connection
        const db = await getDb();

        //Create the category
        await db.collection<Category>("categories").updateOne({
            _id: id
        }, {
            $set: {
                deleted: true
            }
        });

    }

    async getById(id: ObjectId): Promise<Category | null> {

        //Get db connection
        const db = await getDb();

        var category = await db.collection<Category>("categories").findOne({
            _id: id
        })

        return category;
    }

    async getBySlug(slug: string): Promise<Category | null> {

        //Get db connection
        const db = await getDb();

        var category = await db.collection<Category>("categories").findOne({
            slug: slug
        })

        return category;
    }

    async find(params: FindCategoryRequest) {
        const db = await getDb();
        const collection = db.collection<Category>("categories"); // usa il tipo completo per leggere anche "deleted"
        const sort: any = {};

        if (params.orderBy === "id") {
            sort._id = params.ascending ? 1 : -1;
        } else if (params.orderBy === "name") {
            sort.name = params.ascending ? 1 : -1;
        }

        const query: any = {};

        if (params.search && params.search !== "") {
            query.name = { $regex: params.search, $options: "i" }; // case-insensitive
        }

        if (!params.deleted) {
            query.deleted = false;
        }

        const count = await collection.countDocuments(query);

        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;

            let items = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();

            if (!params.deleted) {
                items = items.map(({ deleted, ...rest }) => rest);
            }

            const totalPages = Math.ceil(count / params.perPage!);
            const currentPage = params.page!;

            return {
                items,
                count,
                page: currentPage,
                totalPages,
            };
        } else {
            let items = await collection.find(query).sort(sort).toArray();

            if (!params.deleted) {
                items = items.map(({ deleted, ...rest }) => rest);
            }

            return {
                items,
                count,
            };
        }
    }
}
