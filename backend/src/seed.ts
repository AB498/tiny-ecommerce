import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/ProductModel';
import User from './models/UserModel';
import { productData } from './seeds/data/products';
import { userData } from './seeds/data/users';

dotenv.config();

const seedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-ecommerce');
        console.log(`Connected to DB: ${conn.connection.name}`);

        // Clear existing data (v2 collections)
        console.log('🗑️ Clearing existing data from v2 collections...');
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('✅ v2 data cleared');

        // Let Mongoose handle index creation naturally during insert
        console.log('🔄 Proceeding to seed data...');

        // Seed Products
        await Product.insertMany(productData);
        console.log(`✅ ${productData.length} Products Seeded`);

        // Seed Users
        // We use .create() for users to ensure the pre-save password hashing is triggered
        for (const user of userData) {
            try {
                await User.create(user);
            } catch (err: any) {
                if (err.code === 11000) {
                    console.log(`ℹ️ User ${user.email} already exists, skipping...`);
                } else {
                    throw err;
                }
            }
        }
        console.log(`✅ User seeding check complete`);

        console.log('🚀 Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
