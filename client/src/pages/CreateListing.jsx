import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen'>
        <h1 className='text-4xl font-bold text-center my-8 text-gray-800 tracking-tight'>
            Create a Listing
        </h1>
        <form className='flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl p-8'>
            <div className='flex-1 space-y-5'>
                <input 
                    type="text" 
                    placeholder='Property Name' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200' 
                    id='name' 
                    maxLength='62' 
                    minLength='10' 
                    required
                />

                <textarea 
                    type="text" 
                    placeholder='Description' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-y' 
                    id='description' 
                    required
                ></textarea>

                <input 
                    type="text" 
                    placeholder='Address' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200' 
                    id='address' 
                    required
                />

                <div className='flex gap-6 flex-wrap p-4 bg-gray-50 rounded-xl'>
                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id='sale' className='w-5 h-5 accent-blue-600 cursor-pointer'/>
                        <span className='font-medium text-gray-700'>Sell</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id='rent' className='w-5 h-5 accent-blue-600 cursor-pointer'/>
                        <span className='font-medium text-gray-700'>Rent</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id='parking' className='w-5 h-5 accent-blue-600 cursor-pointer'/>
                        <span className='font-medium text-gray-700'>Parking</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id='Furnished' className='w-5 h-5 accent-blue-600 cursor-pointer'/>
                        <span className='font-medium text-gray-700'>Furnished</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id='offer' className='w-5 h-5 accent-blue-600 cursor-pointer'/>
                        <span className='font-medium text-gray-700'>Offer</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                        <input 
                            type="number" 
                            id='bedrooms' 
                            min='1' 
                            max='10' 
                            required 
                            className='w-20 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />
                        <p className='font-medium text-gray-700'>Beds</p>
                    </div>

                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                        <input 
                            type="number" 
                            id='bath' 
                            min='1' 
                            max='10' 
                            required 
                            className='w-20 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />
                        <p className='font-medium text-gray-700'>Baths</p>
                    </div>

                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                        <input 
                            type="number" 
                            id='regularPrice' 
                            min='1' 
                            max='100000' 
                            required 
                            className='w-24 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />
                        <div className='flex flex-col leading-tight'>
                            <p className='font-medium text-gray-700 text-sm'>Regular price</p>
                            <span className='text-xs text-gray-500'>($ / month)</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                        <input 
                            type="number" 
                            id='discuntedPrice' 
                            min='1' 
                            max='100000' 
                            required 
                            className='w-24 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />
                        <div className='flex flex-col leading-tight'>
                            <p className='font-medium text-gray-700 text-sm'>Discounted Price</p>
                            <span className='text-xs text-gray-500'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col flex-1 gap-6 bg-gray-50 p-6 rounded-xl'>
                <div>
                    <p className='font-semibold text-gray-800 text-lg mb-2'>Images:
                        <span className='font-normal text-gray-500 ml-2 text-sm'>First image will be the cover (max 6)</span>
                    </p>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input 
                            className='flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white' 
                            type="file" 
                            id='images' 
                            accept='image/*' 
                            multiple 
                        />
                        <button className='px-6 py-3 text-green-700 border-2 border-green-600 rounded-xl uppercase hover:bg-green-50 transition-all duration-200 font-semibold hover:shadow-md disabled:opacity-80'>
                            Upload
                        </button>
                    </div>
                </div>

                <button className='w-full py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl uppercase hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-80'>
                    Create Listing
                </button>
            </div>
        </form>
    </main>
  )
}