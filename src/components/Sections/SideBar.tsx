import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { server } from "../utils/database";
import {
  IBrandsList,
  ICategoriesList,
  IPriceList,
  ISearchValues,
} from "../types/common";

export default function SideBar({
  setSearchValues,
  filterData,
  searchValues,
}: {
  setSearchValues: (data: ISearchValues) => void;
  filterData: (resetData?: string | undefined) => void;
  searchValues: ISearchValues;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriesList, setCategoriesList] = useState<ICategoriesList | null>(
    null
  );
  const [brandsList, setBrandsList] = useState<IBrandsList | null>(null);
  const priceList: IPriceList = [
    { min: 0, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 300 },
    { min: 300, max: 400 },
    { min: 400, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2000 },
    { min: 2000, max: 5000 },
  ];

  async function fetchCategories() {
    const data = server.getCategories();
    setCategoriesList(data);
  }
  async function fetchBrands() {
    const data = server.getBrands();
    setBrandsList(data);
  }

  useEffect(() => {
    getSearchFromUrl();
    fetchCategories();
    fetchBrands();
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

  const setSearchIntoUrl = () => {
    const searchParamsText = `text=${searchValues.text}&category=${searchValues.category}&brand=${searchValues.brand}&minPrice=${searchValues.price.min}&maxPrice=${searchValues.price.max}`;
    setSearchParams(searchParamsText);
    filterData();
  };

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 overflow-y-auto bg-white dark:bg-gray-800">
        {/* search by text */}
        <div className="mb-6 pt-2 ">
          <div className="flex items-center mb-3 justify-between gap-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
            >
              Type shoes name
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                className="text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-[4px] text-sm px-3 py-1   dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700"
                onClick={() => {
                  setSearchValues({
                    text: "",
                    category: "",
                    brand: "",
                    price: {
                      min: 0,
                      max: 5000,
                    },
                  });
                  setSearchParams();
                  filterData("reset");
                }}
              >
                <i className="fas fa-xmark"></i>
              </button>
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[4px] text-sm px-3 py-1   dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={setSearchIntoUrl}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <input
            type="text"
            onChange={(e) =>
              setSearchValues({ ...searchValues, text: e.target.value })
            }
            value={searchValues.text}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* search by category */}
        <fieldset className="py-3">
          <legend className="my-2 font-semibold">Categories</legend>

          {categoriesList === null ? (
            <div></div>
          ) : (
            <>
              {categoriesList.length === 0 ? (
                <div>
                  <h2>No categories found</h2>
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {categoriesList?.map((category, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <input
                        id={`category-option-${category}-${index}`}
                        type="radio"
                        name="category"
                        value={category}
                        checked={
                          searchValues.category === category ? true : false
                        }
                        onChange={(e) => {
                          setSearchValues({
                            ...searchValues,
                            category: e.target.value,
                          });
                        }}
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`category-option-${category}-${index}`}
                        className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </fieldset>
        {/* search by Brands */}
        <fieldset className="py-3 mt-5">
          <legend className="my-2 font-semibold">Brands</legend>

          {brandsList === null ? (
            <div></div>
          ) : (
            <>
              {brandsList.length === 0 ? (
                <div>
                  <h2>No brands found</h2>
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {brandsList?.map((brand, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <input
                        id={`brand-option-${brand}-${index}`}
                        type="radio"
                        name="brand"
                        value={brand}
                        onChange={(e) => {
                          setSearchValues({
                            ...searchValues,
                            brand: e.target.value,
                          });
                        }}
                        checked={searchValues.brand === brand ? true : false}
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`brand-option-${brand}-${index}`}
                        className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </fieldset>
        {/* search by Price */}
        <fieldset className="py-3 mt-5">
          <legend className="my-2 font-semibold">Price</legend>

          {priceList === null ? (
            <div></div>
          ) : (
            <>
              {priceList.length === 0 ? (
                <div>
                  <h2>No brands found</h2>
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {priceList?.map((price, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <input
                        id={`price-option-${index}`}
                        type="radio"
                        name="price"
                        value=""
                        checked={
                          searchValues.price.min === price.min &&
                          searchValues.price.max === price.max
                            ? true
                            : false
                        }
                        onChange={() => {
                          setSearchValues({
                            ...searchValues,
                            price: {
                              min: price.min,
                              max: price.max,
                            },
                          });
                        }}
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div className="flex gap-2">
                        <label
                          htmlFor={`price-option-${index}`}
                          className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {price.min}
                        </label>
                        <label
                          htmlFor={`price-option-${index}`}
                          className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          -
                        </label>
                        <label
                          htmlFor={`price-option-${index}`}
                          className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {price.max}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </fieldset>
      </div>
    </aside>
  );
}
