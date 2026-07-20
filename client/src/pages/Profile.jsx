import { useSelector } from "react-redux"
import { useRef } from "react"
import { useState } from "react"
import {updateUserFailure, updateUserSuccess, updateUserStart, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart} from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import { data , Link } from "react-router-dom";


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser,loading , error} = useSelector((state)=> state.user)
  const [FormData,setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const handleChange = (e) => {
    setFormData({...FormData,[e.target.id]:e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(FormData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        console.log(data.message);
        
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(data.message))
      console.log('455',error);
      
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method:`DELETE`,
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data.message));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('api/auth/signout');
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
      return;
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  }

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/."/>
        <img onClick={()=>fileRef.current.click()} src={currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>

        <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg"  onChange={handleChange}/>
        <input type="text" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg" onChange={handleChange}/>
        <input type="password" placeholder="password" defaultValue={currentUser.password} id="password" className="border p-3 rounded-lg" onChange={handleChange}/>

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Update'}</button>

        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>Create Listing</Link>

      </form>
      

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' :''}</p>

    <button onClick={handleShowListing} className="text-green-700 w-full">Show Listing</button>
    <p className="text-red-700 mt-5
    ">
      {showListingError ? 'Error showing listings' : ''}
    </p>

    {userListings && 
      userListings.length > 0 && 
      <div className="text-center mt-7 text-2xl font-semibold">
        <h1>Your Listings</h1>
        {userListings.map((listing) =>
    
      <div key={listing._id}
      className="border rounded-lg p-3 flex justify-between items-center gap-4">
        <Link to={`/listings/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain"/>
        </Link>

        <Link className="text-slate-700 font-semibold  hover:underline truncate flex-1" to={`/listings/${listing._id}`}>
          <p>{listing.name}</p>
        </Link>

        <div className="flex flex-col items-center">

          <button className="text-red-700 uppercase">Delete</button>
          <button className="text-green-700 uppercase">Edit</button>

        </div>
      </div>
        )}
      </div>}
    </div>
  )
}
