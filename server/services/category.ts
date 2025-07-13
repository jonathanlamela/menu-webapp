import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"

import type { CreateCategoryRequest, UpdateCategoryRequest } from "@shared/dtos"
import slugify from "slugify";
import { Category } from "@shared/types";
import path from "path";
import fs from "fs";

export default class CategoryService {

    constructor() {
    }

    async createCategory(data: CreateCategoryRequest): Promise<ObjectId> {

        //Get db connection
        const db = await getDb();

        //Create the category
        const documentCreated = await db.collection<Category>("categories").insertOne({
            name: data.name,
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

        //Create the category
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

        var category = await this.getById(id)

        //Create the category
        const documentDeleted = await db.collection<Category>("categories").deleteOne({
            _id: id
        });

        if (documentDeleted) {
            //Delete image if exists
            if (category?.imageUrl) {
                fs.unlinkSync(path.join(process.cwd(), category.imageUrl))
            }
        } else {
            throw Error('unable to delete category')
        }

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

    find() {

    }
}
