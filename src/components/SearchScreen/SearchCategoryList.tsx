import React, { useState } from 'react';
import { View } from 'react-native';
import CategoryListItem from './CategoryListItem';
import { SearchItemType } from '../../types';

const clothingItems: SearchItemType[] = [
    {
        name: 'Kleding', 
        subcategories: [
            { name: 'Alle' },
            { name: 'Jurken' },
            { name: 'Tops' },
            { name: 'Korte Broeken' },
            { name: 'Rokken' },
            { name: 'Co-ords' },
            { name: 'Zwemkleding & Strandkleding' },
            { name: 'Blazers' },
            { name: 'Blouses' },
            { name: 'Cargo Broeken' },
            { name: 'Jassen & Jacks' },
            { name: 'Truien & Sweatshirts' },
            { name: 'Jeans' },
            { name: 'Truien & Vesten' },
            { name: 'Jumpsuits & Speelpakken' },
            { name: 'Lingerie & Nachtkleding' },
            { name: "Pyjama's" },
            { name: 'Shirts'},
            { name: 'Sportkleding' },
            { name: 'Kostuums & Kleermakerijen' },
            { name: 'Trainingspakken & Joggers' },
            { name: 'Broeken & Leggings' },
        ]
    },
    {
        name: 'Schoenen', 
        subcategories: [
            { name: 'Trainers' },
            { name: 'Sandalen' },
            { name: 'Hakken' },
            { name: 'Sandalen met hak' },
            { name: 'Platte schoenen' },
            { name: 'Balletpumps' },
            { name: 'Laarzen' },
            { name: 'Platte Sandalen' },
            { name: 'Loafers' },
        ]
    },
    { name: 'Accessoires', subcategories: [
        { name: 'Zonnebrillen' },
        { name: 'Haaraccessoires' },
        { name: 'Hoeden' },
        { name: "Sokken & Panty's" },
        { name: 'Riemen' },
        { name: 'Sieraden' },
        { name: 'Mutsen' },
    ]},
    { name: 'Tassen', subcategories: [
        { name: 'Tassen' },
        { name: 'Tote Tassen' },
        { name: 'Schoudertassen' },
        { name: 'Clutchs' },
        { name: 'Portemonnees' },
    ]
    },
    { name: 'Winkels' },
];

const SearchCategoryList = () => {
    const [currentCategories, setCurrentCategories] = useState(clothingItems);

    const handlePress = (item: SearchItemType) => {
        if (item.subcategories) {
            setCurrentCategories(item.subcategories);
        } else {
            console.log('Selected category:', item.name);
        }
    };

    return (
        <View>
            {currentCategories.map((item, index) => (
                <CategoryListItem
                    key={index}
                    searchitem={item}
                    onPress={() => handlePress(item)}
                />
            ))}
        </View>
    );
};

export default SearchCategoryList;
