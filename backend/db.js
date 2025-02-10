const sqlite = require('sqlite3');


const db = new sqlite.Database('clothing_outlet.db');

const createUserTable = `
CREATE TABLE IF NOT EXISTS USERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    IS_ADMIN BOOLEAN DEFAULT FALSE
);`;

const createCartTable = `
CREATE TABLE IF NOT EXISTS CART (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INT NOT NULL,
    PRODUCT_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(ID)
);`;

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS ORDERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INT NOT NULL,
    PRODUCT_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    TOTAL_PRICE REAL NOT NULL,
    ADDRESS TEXT NOT NULL,
    PHONE TEXT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(ID)
);`;

const createProductsTable = `
CREATE TABLE IF NOT EXISTS PRODUCTS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    BRAND TEXT NOT NULL,
    NAME TEXT NOT NULL UNIQUE,
    PRICE REAL NOT NULL,
    IMAGE TEXT NOT NULL
);`;


const insertProductsIfNotExists = () => {
    db.get('SELECT COUNT(*) AS count FROM PRODUCTS', (err, row) => {
        if (err) {
            console.error('Error checking products:', err);
            return;
        }
        
        if (row.count === 0) {
            console.log("Inserting initial products...");
            db.run(`
                INSERT INTO PRODUCTS (BRAND, NAME, PRICE, IMAGE) VALUES
                ('BrandA', 'Puffer Jacket', 20, 'https://www.gliks.com/cdn/shop/files/TheNorthFace-Aconcagua-Jacket-Men-Black-1_1400x1400.jpg'),
                ('BrandA', 'Quarter Zip', 30, 'https://mosaic04.ztat.net/prd/media/comet/TH342G0A0-Q11/PREVIEW_IMG/0002NR0WH8G_image_1718865624.jpg'),
                ('BrandB', 'Running Shoes', 75, 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/30d7afaa-343b-4439-b65d-bb544c65420e/NIKE+REVOLUTION+7.png'),
                ('BrandB', 'AirForce 1', 35, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/05856ac7-0129-4395-bd6e-2fe2669025fb/custom-nike-dunk-low-by-you-su24.png'),
                ('BrandC', 'New Balance 530', 30, 'https://nb.scene7.com/is/image/NB/mr530sg_nb_02_i?$pdpflexf2$&wid=440&hei=440'),
                ('BrandC', 'New Balance Hoodie', 40, 'https://www.dtlr.com/cdn/shop/products/MT33905_20AG_1200x1200.jpg?v=1699896050');
            `);
        } else {
            console.log("Products already exist, skipping insertion.");
        }
    });
};

db.serialize(() => {
    db.run(createUserTable);
    db.run(createCartTable);
    db.run(createOrdersTable);
    db.run(createProductsTable);
    insertProductsIfNotExists();
});

module.exports={
    db
};