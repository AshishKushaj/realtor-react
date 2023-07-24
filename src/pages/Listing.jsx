import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import {FaShare} from 'react-icons/fa'
import  {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";
import SwiperCore from 'swiper';
import "swiper/css/bundle";


export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied,setShareLinkCopied]=useState(false)

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

  return (
    <main className="">
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={EffectFade}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
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
      {shareLinkCopied && <p className=" fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-lg bg-white z-10 p-2 ">Link Copied!!</p>}
    </main>
  );
}
