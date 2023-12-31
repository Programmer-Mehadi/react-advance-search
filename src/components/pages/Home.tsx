import Header from "../Sections/Header";
import SideBar from "../Sections/SideBar";
import ProductCard from "../Sections/ProductCard";
import { useEffect, useState } from "react";
import { IProduct } from "../types/common";
import { server } from "../utils/database";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<null | [] | undefined | IProduct[]>(
    null
  );
  const [searchValues, setSearchValues] = useState({
    text: "",
    category: "",
    brand: "",
    price: {
      min: 0,
      max: 5000,
    },
  });
  async function fetchData() {
    const data: IProduct[] | [] = server.getProducts();
    return data;
  }

  useEffect(() => {
    setSearchIntoUrl();
    getSearchFromUrl();
    filterData();
  }, []);

  const getSearchFromUrl = () => {
    const text = searchParams.get("text") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 5000;
    setSearchValues({
      text,
      category,
      brand,
      price: {
        min: minPrice,
        max: maxPrice,
      },
    });
  };

  useEffect(() => {
    setSearchIntoUrl();
    filterData();
  }, [searchValues]);

  const setSearchIntoUrl = () => {
    let searchParamsText: string = "";

    if (searchValues.text !== "") {
      searchParamsText += `&text=${searchValues.text}`;
    }
    if (searchValues.category !== "" && searchValues.category !== "All") {
      searchParamsText += `&category=${searchValues.category}`;
    }
    if (searchValues.brand !== "" && searchValues.brand !== "All") {
      searchParamsText += `&brand=${searchValues.brand}`;
    }
    if (searchValues.price.max !== 5000) {
      searchParamsText += `&minPrice=${searchValues.price.min}`;
    }
    if (searchValues.price.max !== 5000) {
      searchParamsText += `&maxPrice=${searchValues.price.max}`;
    }
    if (searchParamsText.length > 0) {
      setSearchParams(searchParamsText);
    } else {
      setSearchParams("");
    }
  };

  const filterData = async (resetData = "no") => {
    const myProducts = await fetchData();
    if (resetData === "reset") {
      setProducts(myProducts);
      return;
    }
    // filter by text
    let filteredProductsByText: IProduct[] | undefined | null = [];
    if (searchValues.text !== "") {
      filteredProductsByText = myProducts?.filter((product: IProduct) => {
        return product.title
          .toLowerCase()
          .includes(searchValues.text.toLowerCase());
      });
    } else {
      filteredProductsByText = myProducts;
    }
    let filteredProductsByCategory: IProduct[] | undefined | null = [];
    if (searchValues.category !== "" && searchValues.category !== "All") {
      filteredProductsByCategory = filteredProductsByText?.filter(
        (product: IProduct) => {
          return product.category
            .toLowerCase()
            .includes(searchValues.category.toLowerCase());
        }
      );
    } else {
      filteredProductsByCategory = filteredProductsByText;
    }
    let filteredProductsByBrand: IProduct[] | undefined | null = [];

    if (searchValues.brand !== "" && searchValues.brand !== "All") {
      filteredProductsByBrand = filteredProductsByCategory?.filter(
        (product: IProduct) => {
          return product.brand
            .toLowerCase()
            .includes(searchValues.brand.toLowerCase());
        }
      );
    } else {
      filteredProductsByBrand = filteredProductsByCategory;
    }

    // filter by price
    const filteredProductsByPrice: IProduct[] | undefined =
      filteredProductsByBrand?.filter((product: IProduct) => {
        return (
          product.price >= searchValues.price.min &&
          product.price <= searchValues.price.max
        );
      });

    setProducts(filteredProductsByPrice);
  };

  return (
    <section>
      <Header />
      <SideBar setSearchValues={setSearchValues} searchValues={searchValues} />

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg dark:border-gray-700 mt-14">
          <div>
            {products === null ? (
              <div className="flex justify-center items-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div>
                {products?.length === 0 || products === undefined ? (
                  <div>
                    <h2>No products</h2>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 w-fit mx-auto">
                    {products.map((product: IProduct) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
