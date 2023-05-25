import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Basir',
            email: 'admin@nozama.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'James',
            email: 'user@nozama.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
    ],
    products: [
        {
            name: 'Nike Slim shirt',
            slug: 'nike-slim-shirt',
            category: 'Shirts',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality shirt',
        },
        {
            name: 'Adidas Slim shirt',
            slug: 'adidas-slim-shirt',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 130,
            countInStock: 0,
            brand: 'Adidas',
            rating: 3.0,
            numReviews: 16,
            description: 'high quality shirt',
        },
        {
            name: 'Nike Slim Pants',
            slug: 'nike-slim-pants',
            category: 'Pants',
            image: '/images/p3.jpg',
            price: 125,
            countInStock: 15,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 30,
            description: 'high quality pants',
        },
    ]
}

export default data;