import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {  doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
  const auth = getAuth();

  const [geolocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    images,
    discountedPrice,
    latitude,
    longitude,
  } = formData;
  const navigate = useNavigate();

  const params=useParams()

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You cannot edit!!");
      navigate("/");
    }
  },[auth.currentUser.uid,listing, navigate]);

  useEffect(()=>{
    setLoading(true);
    
    async function fetchListing(){
      
      const docSnap= await getDoc(
        doc(db, "listings", params.listingId)
      )

      if(docSnap.exists()){
        setListing(docSnap.data())
        setFormData({...docSnap.data()})
      }else{
        navigate('/')
        toast.error("Listing donot exist!!")
      }
    }
    fetchListing()
    setLoading(false)
  },[navigate,params.listingId])

  

  function onChange(e) {
    let boolean = null;

    if (e.target.value === "true") boolean = true;
    if (e.target.value === "false") boolean = false;

    // for files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // for text, name, number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
        // if boolean null consider e.targer.value unless consider boolean
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price is more than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("maimum 6 images are allowed");
      return;
    }

    let geolocation = {};
    if (!geolocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lon = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `{${auth.currentUser.uid}-${image.name}-${uuidv4()}}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Image not uploaded!!");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.offer;

    const docRef = doc(db, "listings" ,params.listingId)
    
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success("Listing Updated!!");

    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md pc-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">Edit listing</h1>

      <form onSubmit={onSubmit}>
        <p className=" text-lg mt-6 font-semibold  ">Sale/Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
                  type === "rent"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                } `}
          >
            Sale
          </button>

          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
                  type === "sale"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                } `}
          >
            Rent
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Property Name</p>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={onChange}
          value={name}
          maxLength="30"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded translate  duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-6 shadow-md"
        />

        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>

        <p className=" text-lg mt-6 font-semibold  ">Parking Spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
                  !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            Yes
          </button>

          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
                  parking ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            No
          </button>
        </div>

        <p className=" text-lg mt-6 font-semibold  ">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
                  !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            Yes
          </button>

          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
                  furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          placeholder="Address"
          value={address}
          onChange={onChange}
          minLength="5"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded translate  duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-3 shadow-md"
        />

        <h3 className="flex space-x-6 text-lg font-semibold justify-start mb-3 mt-8 underline">
          Optional
        </h3>
        {
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold ">Latitude</p>
              <input
                type="number"
                id="latitude"
                step="0.000001"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded translate duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">Longitude</p>
              <input
                type="number"
                id="longitude"
                step="0.000001"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded translate duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
        }

        <p className="text-lg mt-6 font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          placeholder="Description"
          onChange={onChange}
          value={description}
          minLength="5"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded translate  duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-6 shadow-md"
        />

        <p className=" text-lg mt-6 font-semibold  ">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full mr-3 ${
                  !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            Yes
          </button>

          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
                text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ml-3 ${
                  offer ? "bg-white text-black" : "bg-slate-600 text-white"
                } `}
          >
            No
          </button>
        </div>

        {/* =============================================== */}
        <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">Rs / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />

                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      Rs / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Listing
        </button>

        {/* ---------------------------------------- */}
      </form>
    </main>
  );
}
