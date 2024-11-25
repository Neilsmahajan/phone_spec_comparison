export interface Phone {
    id: string;
    brand: string;
    model: string;
    price: number;
    releaseDate: string;
    imageUrl?: string;
    displaySize?: string;
    displayResolution?: string;
    camera?: string;
    video?: string;
    ram?: string;
    chipset?: string;
    battery?: string;
    batteryType?: string;
    body?: string;
    osType?: string;
    storage?: string;
}
  
  export const phones: Phone[] = [
    { id: "1", brand: "Apple", model: "iPhone 13", price: 799, releaseDate: "2021-09-24" },
    { id: "2", brand: "Samsung", model: "Galaxy S21", price: 799, releaseDate: "2021-01-29" },
    { id: "3", brand: "Google", model: "Pixel 6", price: 599, releaseDate: "2021-10-28" },
    { id: "4", brand: "OnePlus", model: "9 Pro", price: 969, releaseDate: "2021-03-23" },
    { id: "5", brand: "Xiaomi", model: "Mi 11", price: 749, releaseDate: "2021-02-08" },
    { id: "6", brand: "Apple", model: "iPhone 12", price: 699, releaseDate: "2020-10-23" },
    { id: "7", brand: "Samsung", model: "Galaxy S20", price: 999, releaseDate: "2020-03-06" },
    { id: "8", brand: "Google", model: "Pixel 5", price: 699, releaseDate: "2020-10-15" },
    { id: "9", brand: "OnePlus", model: "8T", price: 749, releaseDate: "2020-10-16" },
    { id: "10", brand: "Xiaomi", model: "Mi 10", price: 799, releaseDate: "2020-02-14" },
    {
        id: "177",
        brand: "Samsung",
        model: "Galaxy A16 5G",
        price: 230,
        releaseDate: "2024-10-07",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a16-5g.jpg",
        displaySize: "6.7\"",
        displayResolution: "1080x2340 pixels",
        camera: "50MP",
        video: "1080p",
        ram: "4/8GB RAM",
        chipset: "Dimensity 6300",
        battery: "5000mAh",
        batteryType: "25W",
        body: "200g, 7.9mm thickness",
        osType: "Android 14, up to 6 major upgrades",
        storage: "128GB/256GB storage, microSDXC"
    },
    {
        id: "195",
        brand: "Samsung",
        model: "Galaxy Z Fold Special",
        price: 440,
        releaseDate: "2024-03-26",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold-special-edition.jpg",
        displaySize: "10.4\"",
        displayResolution: "1200x2000 pixels",
        camera: "8MP",
        video: "1080p",
        ram: "4GB RAM",
        chipset: "N/A",
        battery: "7040mAh",
        batteryType: "15W",
        body: "465/467g, 7mm thickness",
        osType: "Android 14, One UI 6.1",
        storage: "64GB/128GB storage, microSDXC",
    },
  ];
  
  export const brands = Array.from(new Set(phones.map(phone => phone.brand)));