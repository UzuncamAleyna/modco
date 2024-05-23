//HOME SCREEN
export type Item = {
    id: number;
    name: string;
    price: number;
    brand: string;
    image: any;
    category: string;
};

export type ItemSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type FavoriteItem = {
    id: string;
    item: Item;
    size: ItemSize;
    item_id: number;
    price: number;
};

export type OrderStatus = {
    pending: 'in afwachting',
    processing: 'verwerking',
    shipped: 'verzonden',
    delivered: 'geleverd',
    canceled: 'geannuleerd',
};

export type CategoryItemType = {
    id: number;
    name: string;
    image: any;
};


//SEARCH SCREEN
export type SearchItemType = {
    name: string;
    subcategories?: SearchItemType[];
};

