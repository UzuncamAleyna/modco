const shopImage = require('../../assets/images/shop.jpg');
const pinkDressImage = require('../../assets/images/pink-dress.jpg');

const shops = [
    {
        id: 1,
        name: 'Esmée Shop',
        image: shopImage,
        followers: 2000,
        description: 'Esmée Shop biedt een unieke collectie mode die creativiteit en vakmanschap combineert. Elk stuk is met zorg ontworpen om je een stijlvol en exclusief gevoel te geven.',
        collections: [
          {
            name: 'Pinko Fever',
            items: [
              { id: 1, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
              { id: 2, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
              { id: 3, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
              { id: 4, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
            ],
          },
        ],
        contactEmail: 'contact@esmeeshop.com',
        reviews: [
          {
              author: 'Aleyna Uzuncam',
              date: '22-05-2024',
              name: 'Pink Fairy Tale Dress',
              itemImage: pinkDressImage,
              rating: 4,
              fitting: 'Op maat',
              content: 'De Pink Fairy Tale Dress in maat S past perfect en is prachtig afgewerkt. De kleur is precies zoals op de fotos. Ik droeg hem naar een bruiloft en kreeg veel complimenten. Een echte aanrader!'
          },
          {
              author: 'Sena Uzuncam',
              date: '25-05-2024',
              name: 'Pink Fairy Tale Dress',
              itemImage: pinkDressImage,
              rating: 5,
              fitting: 'Op maat',
              content: 'De Pink Fairy Tale Dress is een prachtige jurk, maar de maat valt iets kleiner uit dan verwacht. Ik raad aan om een maat groter te bestellen.'
          },
        ]
      }, 
        {
            id: 2,
            name: 'Esmée Shop',
            image: shopImage,
            followers: 2000,
            description: 'Esmée Shop biedt een unieke collectie mode die creativiteit en vakmanschap combineert. Elk stuk is met zorg ontworpen om je een stijlvol en exclusief gevoel te geven.',
            collections: [
            {
                name: 'Pinko Fever',
                items: [
                { id: 1, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
                { id: 2, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
                { id: 3, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
                { id: 4, name: 'Pink Fairy Tale Dress', image: pinkDressImage, price: 22, brand: 'Esméé Rose' },
                ],
            },
            ],
            contactEmail: 'contact@esmeeshop.com',
            reviews: [
                {
                    author: 'Aleyna Uzuncam',
                    date: '22-05-2024',
                    name: 'Pink Fairy Tale Dress',
                    itemImage: pinkDressImage,
                    rating: 4,
                    fitting: 'Op maat',
                    content: 'De Pink Fairy Tale Dress in maat S past perfect en is prachtig afgewerkt. De kleur is precies zoals op de fotos. Ik droeg hem naar een bruiloft en kreeg veel complimenten. Een echte aanrader!'
                },
                {
                    author: 'Sena Uzuncam',
                    date: '25-05-2024',
                    name: 'Pink Fairy Tale Dress',
                    itemImage: pinkDressImage,
                    rating: 5,
                    fitting: 'Op maat',
                    content: 'De Pink Fairy Tale Dress is een prachtige jurk, maar de maat valt iets kleiner uit dan verwacht. Ik raad aan om een maat groter te bestellen.'
                },
              ]
            },
  ];

export default shops;