import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: any): Promise<import("./entities/product.entity").Product>;
    findAll(categoryId?: string): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: any): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
