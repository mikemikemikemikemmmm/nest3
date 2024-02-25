import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, UpdateDateColumn, Column, OneToOne, ManyToMany, JoinTable, Relation, ViewEntity, Unique } from "typeorm"
export abstract class HasIdMixin {
    @PrimaryGeneratedColumn()
    id: number
    @UpdateDateColumn()
    updated_at: Date
}
@Unique(["menuRoute", "categoryRoute", "subCategoryRoute"])
@Entity()
export class Navigation extends HasIdMixin {
    @Column()
    menuId: number
    @Column()
    menuName: string
    @Column()
    menuRoute: string
    @Column()
    menuOrder: number

    @Column({ nullable: true })
    categoryId: number
    @Column({ nullable: true })
    categoryName: string
    @Column({ nullable: true })
    categoryRoute: string
    @Column({ nullable: true })
    categoryOrder: number

    @Column({ nullable: true })
    subCategoryId: number
    @Column({ nullable: true })
    subCategoryName: string
    @Column({ nullable: true })
    subCategoryRoute: string
    @Column({ nullable: true })
    subCategoryOrder: number
    @OneToMany(() => Series, (s) => s.navigation)
    series: Series[]
}
// @Entity()
// export class Nav extends NavItemMixin {
//     @OneToMany(() => Category, (c) => c.nav)
//     categorys: Category[]
// }
// @Unique(["route","nav"])
// @Entity()
// export class Category extends NavItemMixin {
//     @ManyToOne(() => Nav, (n) => n.categorys)
//     nav: Nav
//     @OneToMany(() => SubCategory, (sc) => sc.category)
//     subCategorys: SubCategory[]
// }
// @Unique(["route","category"])
// @Entity()
// export class SubCategory extends NavItemMixin {
//     @ManyToOne(() => Category, (c) => c.subCategorys)
//     category: Category
//     @OneToMany(() => Series, (s) => s.subCategory)
//     series: Series[]
// }
// @Entity()
// export class Editing extends HasIdMixin {
//     @Column()
//     targetEntity: string
//     @Column()
//     targetId: Number
//     @ManyToOne(() => User, u => u.editing)
//     user: Relation<User>
// }

@Entity()
export class User extends HasIdMixin {
    @Column({ unique: true })
    email: string
    @Column()
    password: string
    @Column({nullable:true})
    role: string; //userRole admin or guest
}
@Entity()
export class Gender extends HasIdMixin {
    @Column({ unique: true })
    name: string
    @OneToMany(() => Product, p => p.gender)
    products: Product[]
}
@Entity()
export class Color extends HasIdMixin {
    @Column({ unique: true })
    name: string
    @OneToMany(() => SubProduct, sp => sp.color)
    subProducts: SubProduct[]
}
@Entity()
export class Series extends HasIdMixin {
    @Column()
    name: string
    @Column()
    order: number
    @ManyToOne(() => Navigation, n => n.series)
    navigation: Navigation
    @OneToMany(() => Product, p => p.series)
    products: Product[]
}
@Entity()
export class Product extends HasIdMixin {
    @Column()
    name: string
    @Column()
    order: number
    // @Column()
    // imageCount: number
    @Column()
    imageFileNameListStringifyJson: string
    @ManyToOne(() => Gender, g => g.products)
    gender: Gender
    @ManyToOne(() => Series, (s) => s.products)
    series: Series
    @OneToMany(() => SubProduct, sp => sp.product)
    subProducts: SubProduct[]
}
@Unique(["colorId", "productId"])
@Entity()
export class SubProduct extends HasIdMixin {
    @Column()
    productId: number
    @ManyToOne(() => Product, p => p.subProducts)
    product: Product
    @Column()
    colorId: number
    @ManyToOne(() => Color, c => c.subProducts)
    color: Color[]
    @Column()
    order: number
    @Column()
    price: number
    // @Column()
    // size_S: number
    // @Column()
    // size_M: number
    // @Column()
    // size_L: number
    @OneToMany(() => Stock, s => s.subproduct)
    stocks: Relation<Stock[]>
}
@Entity()
export class Size extends HasIdMixin {
    @Column({ unique: true })
    name: string
    @Column()
    order: number
    @OneToMany(() => Stock, s => s.size)
    stocks: Relation<Stock[]>
}

@Entity()
@Unique(["subproductId", "sizeId"])
export class Stock extends HasIdMixin {
    @Column()
    subproductId: number
    @ManyToOne(() => SubProduct, sp => sp.stocks)
    subproduct: SubProduct
    @Column()
    sizeId: number
    @ManyToOne(() => Size, s => s.stocks)
    size: Size
    @Column()
    stock: number
}