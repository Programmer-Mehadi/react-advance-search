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
  images: string[] | [];
};

type IPrice = {
  min: number;
  max: number;
};

export type IPriceList = IPrice[];

export type ICategoriesList = string[];
export type IBrandsList = string[];
export type ISearchValues = {
  text: string;
  category: string;
  brand: string;
  price: {
    min: number;
    max: number;
  };
};
