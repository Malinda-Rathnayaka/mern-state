import React from 'react';
import { useState } from 'react';
// Added 'ref' and fixed 'uploadBytesResumable' imports here:
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const {currentUser} = useSelector (state => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 0,
        offer: false,
        parking: false,
        Furnished: false,
    });

    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(formData);
    
    
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            
            // FIX: Changed 'Promises' to 'Promise'
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
            
                setImageUploadError(false);
                setUploading(false);
            })
            .catch((err) => {
                setImageUploadError('Image upload failed (2 mb per image)');
                setUploading(false);
            });
        }else{
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        // FIX: Capitalized 'Promise'
        return new Promise((resolve , reject ) =>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            
            // FIX: Corrected function name to uploadBytesResumable
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = 
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Note: fixed minor typo 'byteTransferred' to 'bytesTransferred'
                    console.log(`upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL); // Changed variable name from getDownloadURL to downloadURL to prevent conflicts
                    });
                }
            )
        }); 
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_ , i) => i !== index),    
        })
    }

    const handleChane = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload as least one image')
            if(+formData.regularPrice < +formData.discountedPrice) return setError('Discounted price must be lower than regular price')
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create' ,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    

  return (
    <main className='p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen'>
        <h1 className='text-4xl font-bold text-center my-8 text-gray-800 tracking-tight'>
            Create a Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl p-8'>
            <div className='flex-1 space-y-5'>
                <input 
                    type="text" 
                    placeholder='Property Name' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200' 
                    id='name' 
                    maxLength='62' 
                    minLength='10' 
                    required
                    onChange={handleChane}
                    value={formData.name}
                />

                <textarea 
                    type="text" 
                    placeholder='Description' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-y' 
                    id='description' 
                    required
                    onChange={handleChane}
                    value={formData.description}
                ></textarea>

                <input 
                    type="text" 
                    placeholder='Address' 
                    className='w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200' 
                    id='address' 
                    required
                    onChange={handleChane}
                    value={formData.address}
                />

                <div className='flex gap-6 flex-wrap p-4 bg-gray-50 rounded-xl'>
                    <div className='flex items-center gap-2'>
                        <input type="checkbox" 
                        id='sale' 
                        className='w-5 h-5 accent-blue-600 cursor-pointer'
                        onChange={handleChane}
                        checked={formData.type === 'sale'}
                        />
                        <span className='font-medium text-gray-700'>Sell</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" 
                        id='rent' 
                        className='w-5 h-5 accent-blue-600 cursor-pointer'
                        onChange={handleChane}
                        checked={formData.type === 'rent'}
                        />
                        <span className='font-medium text-gray-700'>Rent</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" 
                        id='parking' 
                        className='w-5 h-5 accent-blue-600 cursor-pointer'
                        onChange={handleChane}
                        checked={formData.parking}
                        />
                        <span className='font-medium text-gray-700'>Parking</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox"
                        id='furnished' 
                        className='w-5 h-5 accent-blue-600 cursor-pointer'
                        onChange={handleChane}
                        checked={formData.furnished}
                        />
                        <span className='font-medium text-gray-700'>Furnished</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="checkbox" 
                        id='offer' 
                        className='w-5 h-5 accent-blue-600 cursor-pointer'
                        onChange={handleChane}
                        checked={formData.offer}
                        />
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
                            onChange={handleChane}
                            value={formData.bedrooms}
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
                            onChange={handleChane}
                            value={formData.bathrooms}
                        />
                        <p className='font-medium text-gray-700'>Baths</p>
                    </div>

                    <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                        <input 
                            type="number" 
                            id='regularPrice' 
                            min='50' 
                            max='100000' 
                            required 
                            className='w-24 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                            onChange={handleChane}
                            value={formData.regularPrice}

                        />
                        <div className='flex flex-col leading-tight'>
                            <p className='font-medium text-gray-700 text-sm'>Regular price</p>
                            <span className='text-xs text-gray-500'>($ / month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                        <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl'>
                            <input 
                                type="number" 
                                id='discountedPrice' 
                                min='0' 
                                max='100000' 
                                required 
                                className='w-24 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                onChange={handleChane}
                                value={formData.discountedPrice}
                            />
                            <div className='flex flex-col leading-tight'>
                                <p className='font-medium text-gray-700 text-sm'>Discounted Price</p>
                                <span className='text-xs text-gray-500'>($ / month)</span>
                            </div>
                        </div>
                    )}
                   
                </div>
            </div>

            <div className='flex flex-col flex-1 gap-6 bg-gray-50 p-6 rounded-xl'>
                <div>
                    <p className='font-semibold text-gray-800 text-lg mb-2'>Images:
                        <span className='font-normal text-gray-500 ml-2 text-sm'>First image will be the cover (max 6)</span>
                    </p>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input onChange={(e)=>setFiles(e.target.files)}
                            className='flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white' 
                            type="file" 
                            id='images' 
                            accept='image/*' 
                            multiple 
                        />
                        <button type='button'
                        disabled={uploading}
                        onClick={handleImageSubmit} className='px-6 py-3 text-green-700 border-2 border-green-600 rounded-xl uppercase hover:bg-green-50 transition-all duration-200 font-semibold hover:shadow-md disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div 
                            key={url}
                            className='flex justify-between p-3 border items-center'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                            <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Delete</button>
                        </div>
                    ))
                }

                <button disabled={loading || uploading} className='w-full py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl uppercase hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-80'>
                    {loading ? 'Creating...' : 'Create listing'}
                </button>
                {error && <p className='text-red-700'>{error}</p>}
            </div>
        </form>
    </main>
  )
}