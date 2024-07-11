export class productDTO {
  constructor(member_id, product_id, name, description, price, category) {
    this.member_id = member_id;
    this.product_id = product_id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
  }
}
