import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord,setContactLandlord]=useState(false)

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
      }
    }
    fetchListing();
    setLoading(false);
  }, [params.listingId]);

  if (loading || !listing) {
    return <Spinner />;
  }

  const auth = getAuth();

  return (
    <main className="">
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={EffectFade}
        autoplay={{ delay: 4000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[600px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className=" fixed right-[3%] top-[13%] z-10 bg-white cursor-pointer w-12 h-12 rounded-full border-gray-600 border-2 flex justify-center items-center  "
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, [2000]);
        }}
      >
        <FaShare className="text-lg "></FaShare>
      </div>
      {shareLinkCopied && (
        <p className=" fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-lg bg-white z-10 p-2 ">
          Link Copied!!
        </p>
      )}

      <div className=" m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5 ">
        <div className=" w-full ">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - Rs{" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {listing.type === "rent" ? "/ month" : ""}
          </p>
          <p className="flex items-center font-sem mt-6 mb-3">
            <FaMapMarkerAlt className="text-green-700 mr-1" /> {listing.address}
          </p>

          <div className="flex justify-start items-center space-x-4 w-[75%] ">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-2 text-white text-center font-semibold shadow-md ">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-blue-800 w-full max-w-[200px] rounded-md p-2 text-white text-center font-semibold shadow-md">
                Discounted Rs {listing.regularPrice - listing.discountedPrice}
              </p>
            )}
          </div>

          <p className="mt-3 mb-3">
            <span className="font-semibold">Description -</span>{" "}
            {listing.description}
          </p>

          <ul className="flex items-center space-x-2 sm:space-x-10  text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>

          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6 ">
              <button 
                onClick={()=>setContactLandlord(!contactLandlord)}
              className="transition duration-150 ease-in-out text-white px-7 py-3 rounded font-medium text-sm uppercase shadow-md focus:shadow-lg hover:shadow-lg w-full text-center hover:bg-blue-800 bg-blue-600 ">
                Contact Landlord
              </button>
            </div>
          )}

          {
            contactLandlord && <Contact userRef={listing.userRef} 
              listing={listing}
            />
          }

        </div>
        <div className="bg-blue-600 w-full h-[200px] lg-[400px] z-10 overflow-x-hidden "></div>
      </div>
    </main>
  );
}
