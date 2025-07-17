import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"
import { CreateProductRequest, UpdateProductRequest, FindProductRequest, FindProductResponse, ProductWithCategory } from "shared/dtos/product";
import { Category, Product } from "shared/types";

// Service class for handling product-related operations
export default class ProductService {

    // Create a new product
    async create(model: CreateProductRequest): Promise<ObjectId> {
        const db = await getDb();
        const documentCreated = await db.collection<Product>("products").insertOne({
            name: model.name,
            price: model.price,
            categoryId: ObjectId.createFromHexString(model.categoryId!),
            descriptionShort: model.descriptionShort,
            deleted: false,
        });

        if (documentCreated.acknowledged) {
            return documentCreated.insertedId;
        } else {
            throw Error('unable to create product');
        }
    }

    // Update an existing product by ID
    async update(id: ObjectId, model: UpdateProductRequest) {
        const db = await getDb();
        const updateFields: Partial<Product> = {};
        if (model.name != null) updateFields.name = model.name;
        if (model.price != null) updateFields.price = model.price;
        if (model.categoryId != null) updateFields.categoryId = ObjectId.createFromHexString(model.categoryId!);
        if (model.descriptionShort != null) updateFields.descriptionShort = model.descriptionShort;

        const documentUpdated = await db.collection<Product>("products").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!documentUpdated.acknowledged) {
            throw Error('unable to update product');
        }
    }

    // Soft-delete a product by setting deleted to true
    async delete(id: ObjectId) {
        const db = await getDb();
        await db.collection<Product>("products").updateOne({
            _id: id
        }, {
            $set: {
                deleted: true
            }
        });
    }

    // Find products with filtering, sorting, and pagination
    async find(params: FindProductRequest): Promise<FindProductResponse> {
        const db = await getDb();
        const collection = db.collection<Product>("products");
        const sort: any = {};

        if (params.orderBy === "id") {
            sort._id = params.ascending ? 1 : -1;
        } else if (params.orderBy === "name") {
            sort.name = params.ascending ? 1 : -1;
        } else if (params.orderBy === "price") {
            sort.price = params.ascending ? 1 : -1;
        }

        const query: any = {};

        if (params.search && params.search !== "") {
            query.name = { $regex: params.search, $options: "i" };
        }

        if (params.categorySlug) {
            const category = await db.collection<Category>("categories").findOne({ slug: params.categorySlug });
            if (!category) {
                throw Error('Category not found');
            }
            query.categoryId = category._id;
        }


        if (!params.deleted) {
            query.deleted = false;
        }

        const pipeline: any[] = [
            { $match: query },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" }
        ];

        if (params.orderBy === "category") {
            pipeline.push({
                $sort: { "category.name": params.ascending ? 1 : -1 }
            });
        } else {
            pipeline.push({
                $sort: sort
            });
        }

        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;
            pipeline.push({ $skip: skip }, { $limit: limit });
        }

        const count = await collection.countDocuments(query);

        let products = await collection.aggregate<ProductWithCategory>(pipeline).toArray();

        // Remove 'deleted' field from category
        products = products.map((item: any) => {
            const { deleted, ...categoryRest } = item.category || {};
            return {
                ...item,
                category: categoryRest
            };
        });

        if (!params.deleted) {
            products = products.map(({ deleted, ...rest }) => rest);
        }

        if (params.paginated) {
            const totalPages = Math.ceil(count / params.perPage!);
            const currentPage = params.page!;
            if (!params.deleted) {
                products = products.map(({ deleted, ...rest }) => rest);
            }
            return {
                params,
                products,
                count,
                page: currentPage,
                totalPages,

            };
        } else {
            if (!params.deleted) {
                products = products.map(({ deleted, ...rest }) => rest);
            }
            return {
                products,
                count,
                params,

            };
        }
    }



    // Get a product by its ID
    async getById(id: ObjectId): Promise<Product | null> {
        const db = await getDb();
        var product = await db.collection<Product>("products").findOne({
            _id: id
        });
        return product;
    }

}
