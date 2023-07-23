import { getAuth, updateCurrentUser, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const [changeDetail, setChangeDetail] = useState(false);

  const navigate = useNavigate();
  const { name, email } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // update name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in firebase database
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });

        toast.success("Success!!!");
      }
    } catch (error) {
      toast.error("Something went wrong!!!");
    }
  }

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    async function fetchUserListings() {
      let listings = [];
      const listingRef = collection(db, "listings");

      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    }

    fetchUserListings();
  }, [auth.currentUser.uid]);


    async function onDelete(listingId){

      if(window.confirm("Are you sure you want to delete?")){
        await deleteDoc(doc(db,'listings',listingId))

        const updateListing=listings.filter((listing)=>
          listing.id!==listingId
        )

        setListings(updateListing)
        toast.success("Listing Deleted!!")

      }
    }

    function onEdit(listingId){
      navigate(`/edit-listing/${listingId}`)
    }

  return (
    <div>
      <section className="max-w-6xl mx-auto flex flex-col items-center justify-center ">
        <h1 className="text-center text-3xl font-semibold mt-6">My Profile</h1>

        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* name */}

            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-grey-700 bg-white border  border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetail && "bg-red-200 focus:bg-red-200 "
              } `}
            />

            {/* email */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 "
            />

            <div className="flex justify-between text-sm sm:text-lg mb-6">
              <p className="flex item-center">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className=" text-red-600 hover:text-red-900 transition ease-in-out duration-200 ml-1 cursor-pointer "
                >
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>

              <p
                onClick={onLogout}
                className="text-blue-500 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200 "
              >
                Sign Out
              </p>
            </div>
          </form>

          <button
            type="submit "
            className="w-full  bg-blue-500 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition-duration-250 ease-in-out hover:shadow-lg active:bg-blue-800 "
          >
            <Link
              className="flex justify-center items-center"
              to="/create-listing"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent you home
            </Link>
          </button>
        </div>
      </section>

      <div>
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl mg-6 text-center font-semibold mt-10">
              My Listings
            </h2>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={()=>onDelete(listing.id)}
                  onEdit={()=>onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
