import { ObjectId } from "mongodb";
import { getDb } from "../utils/db"
import { CreateProductRequest, FindProductRequest, UpdateProductRequest } from "@shared/dtos";
import { Product } from "@shared/types";

// Service class for handling product-related operations
export default class ProductService {

    // Create a new product
    async create(model: CreateProductRequest) {

        // Get db connection
        const db = await getDb();

        // Insert the new product document
        const documentCreated = await db.collection<Product>("products").insertOne({
            name: model.name,
            price: model.price,
            categoryId: ObjectId.createFromHexString(model.categoryId),
            descriptionShort: model.descriptionShort,
            deleted: false,
        });

        // Return the inserted ID if successful
        if (documentCreated.acknowledged) {
            return documentCreated.insertedId;
        } else {
            throw Error('unable to create product')
        }
    }

    // Update an existing product by ID
    async update(id: ObjectId, model: UpdateProductRequest) {
        // Get db connection
        const db = await getDb();

        // Build update object only with non-null fields
        const updateFields: any = {};
        if (model.name != null) updateFields.name = model.name;
        if (model.price != null) updateFields.price = model.price;
        if (model.categoryId != null) updateFields.categoryId = ObjectId.createFromHexString(model.categoryId);
        if (model.descriptionShort != null) updateFields.descriptionShort = model.descriptionShort;

        // Update the product document with provided fields
        const documentUpdated = await db.collection<Product>("products").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        // Throw error if update failed
        if (!documentUpdated.acknowledged) {
            throw Error('unable to update product');
        }

    }

    // Soft-delete a product by setting deleted to true
    async delete(id: ObjectId) {

        // Get db connection
        const db = await getDb();

        // Update the product's deleted field
        const documentDeleted = await db.collection<Product>("products").updateOne({
            _id: id
        }, {
            $set: {
                deleted: true
            }
        });

        // Throw error if update failed
        if (!documentDeleted.acknowledged) {
            throw Error('unable to delete product');
        }

    }

    // Find products with filtering, sorting, and pagination
    async find(params: FindProductRequest) {
        const db = await getDb();
        const collection = db.collection<Product>("products");
        const sort: any = {};

        // Set sorting field and order
        if (params.orderBy === "id") {
            sort._id = params.ascending ? 1 : -1;
        } else if (params.orderBy === "name") {
            sort.name = params.ascending ? 1 : -1;
        } else if (params.orderBy === "price") {
            sort.price = params.ascending ? 1 : -1;
        }

        const query: any = {};

        // Add search filter if provided
        if (params.search && params.search !== "") {
            query.name = { $regex: params.search, $options: "i" };
        }

        // Exclude deleted products unless requested
        if (!params.deleted) {
            query.deleted = false;
        }

        // If sorting by category, use aggregation to join and sort by category name
        if (params.orderBy === "category") {
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
                { $unwind: "$category" },
                {
                    $sort: {
                        "category.name": params.ascending ? 1 : -1
                    }
                }
            ];

            // Add pagination to aggregation pipeline if needed
            if (params.paginated) {
                const skip = (params.page! - 1) * params.perPage!;
                const limit = params.perPage!;
                pipeline.push({ $skip: skip }, { $limit: limit });
            }

            // Count total matching documents
            const count = await collection.countDocuments(query);

            // Get items from aggregation
            let items = await collection.aggregate(pipeline).toArray();

            // Remove deleted field if not requested
            if (!params.deleted) {
                items = items.map(({ deleted, ...rest }) => rest);
            }

            // Return paginated result if needed
            if (params.paginated) {
                const totalPages = Math.ceil(count / params.perPage!);
                const currentPage = params.page!;
                return {
                    items,
                    count,
                    page: currentPage,
                    totalPages,
                };
            } else {
                return {
                    items,
                    count,
                };
            }
        }

        // Normal sorting and pagination
        const count = await collection.countDocuments(query);

        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;

            let items = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();

            // Remove deleted field if not requested
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

            // Remove deleted field if not requested
            if (!params.deleted) {
                items = items.map(({ deleted, ...rest }) => rest);
            }

            return {
                items,
                count,
            };
        }
    }

    // Get products by category slug with filtering, sorting, and pagination
    async getByCategorySlug(categorySlug: string, params: FindProductRequest): Promise<Product[]> {

        // Get db connection
        const db = await getDb();

        // Find the category by slug
        const category = await db.collection("categories").findOne({ slug: categorySlug });
        if (!category) {
            return [];
        }

        // Build query for products in the category
        const query: any = {
            categoryId: category._id,
        };

        // Add search filter if provided
        if (params.search && params.search !== "") {
            query.name = { $regex: params.search, $options: "i" };
        }

        // Exclude deleted products unless requested
        if (!params.deleted) {
            query.deleted = false;
        }

        const collection = db.collection<Product>("products");
        const sort: any = {};

        // Set sorting field and order
        if (params.orderBy === "id") {
            sort._id = params.ascending ? 1 : -1;
        } else if (params.orderBy === "name") {
            sort.name = params.ascending ? 1 : -1;
        } else if (params.orderBy === "price") {
            sort.price = params.ascending ? 1 : -1;
        }

        let items: Product[];

        // Apply pagination if needed
        if (params.paginated) {
            const skip = (params.page! - 1) * params.perPage!;
            const limit = params.perPage!;
            items = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
        } else {
            items = await collection.find(query).sort(sort).toArray();
        }

        // Remove deleted field if not requested
        if (!params.deleted) {
            items = items.map(({ deleted, ...rest }) => rest as Product);
        }

        return items;
    }

    // Get a product by its ID
    async getById(id: ObjectId): Promise<Product | null> {

        // Get db connection
        const db = await getDb();

        // Find the product by ID
        var product = await db.collection<Product>("products").findOne({
            _id: id
        });
        return product;
    }

}
