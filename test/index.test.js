// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

describe("Product API Testing", () => {
  test("should return product data with id 1", async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
  });

  test("should check products.length with limit", async () => {
    const productsLimit = 30;
    const productData = await fetchProductsData();
    expect(productData.products.length).toBe(productsLimit);
  });

  test("should return product data with id 1", async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
    expect(productData.title).toEqual("iPhone 9");
  });
});

// Mocking
// https://jestjs.io/docs/mock-functions

const { fetchCartsData } = require('../src/dataService');

jest.mock('../src/dataService', () => {
  const originalModule = jest.requireActual('../src/dataService');
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

describe('Cart API Testing', () => {
  test('should compare total cart items with length of fetched data', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  test('should compare total length of carts data with total', async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
      { id: 3, productId: 3, quantity: 3 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(6); 
  });
});


// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

let productData;

beforeAll(async () => {
  productData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  describe("convertToRupiah", () => {
    test('should convert 100 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/);
      expect(typeof priceInRupiah).toBe('string');
    });
    
    test('should convert 1000 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(1000);
      expect(priceInRupiah).toMatch(/Rp\s15\.436\.000,\d{2}/);
    });      
  });

  describe("countDiscount", () => {
    test("it should calculate discounted price correctly", () => {
      const price = 1000;
      const discount = 10;
      const result = countDiscount(price, discount);
      expect(result).toEqual(900);
    });

    test("it should handle zero discount", () => {
      const price = 1000;
      const discount = 0;
      const result = countDiscount(price, discount);
      expect(result).toEqual(1000);
    });
  });

  describe("setProductsCards", () => {
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productData.products);
      expect(productsCards).toBeInstanceOf(Array);
      expect(productsCards.length).toBeGreaterThan(0);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});