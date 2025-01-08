'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SuccessModal from '@/components/Success';
import Image from 'next/image';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    quantity: number;
    rating: {
        rate: number;
        count: number;
    };
}

const SingleProduct = () => {
    const [data, setData] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetch(`https://fakestoreapi.com/products/${id}`)
                .then((res) => res.json())
                .then((res) => {
                    setData(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!data) return;

        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const productExists = existingCart.find((item: Product) => item.id === data.id);
        let updatedCart;
        if (productExists) {
            updatedCart = existingCart.map((item: Product) =>
                item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...existingCart, { ...data, quantity: 1 }];
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setSuccessMessage('Product added to cart successfully!');
        setIsModalOpen(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!data ? (
                    <div className="flex items-center justify-center pt-20 bg-gray-100">
                    <div className="flex flex-col items-center">
                      {/* Spinner */}
                      <div
                        className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                        aria-label="Loading spinner"
                      ></div>
                      {/* Text */}
                      <p className="mt-4 text-xl font-semibold text-gray-700">
                        Loading, please wait...
                      </p>
                    </div>
                  </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
                            <Image
                                src={data.image}
                                alt={data.title}
                                width={1000}
                                height={1000}
                                className="w-full h-auto max-w-md rounded-lg"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="md:w-1/2 md:pl-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.title}</h1>
                            <p className="text-xl text-gray-700 mb-6">{data.description}</p>
                            <p className="text-2xl text-green-600 font-bold mb-4">${data.price}</p>
                            <p className="text-lg text-gray-700 mb-4">
                                <strong>Category:</strong> {data.category}
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                <strong>Rating:</strong> {data.rating.rate} ({data.rating.count} reviews)
                            </p>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart} // Add the product to localStorage
                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 px-6 rounded-md hover:bg-yellow-700"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                vCart={true}
                message={successMessage}
            />
        </div>
    );
};

export default SingleProduct;