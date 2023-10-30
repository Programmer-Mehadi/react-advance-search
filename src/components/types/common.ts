export type IProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  image: string[] | [];
};
