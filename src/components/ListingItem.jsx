import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { GrMapLocation } from "react-icons/gr";
import { TbTrashXFilled } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li className="relative m-[10px] flex flex-col bg-white justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150">
      <Link className="contents" to={`category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full hover:scale-105 duration-200 ease-in  object-cover "
          loading="lazy"
          src={listing.imgUrls[0]}
          alt="picture"
        />
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp.toDate()}
        </Moment>

        <div className="w-full p-[10px] ">
          <div className="flex items-center space-x-1">
            <GrMapLocation className="h-4 w-4 text-green-600" />
            <p className="mb-[2px] font-semibold text-sm text-gray-600 truncate ">
              {listing.address}
            </p>
          </div>

          <p className="font-semibold m-0 text-xl truncate ">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            Rs{" "}
            {listing.discountedPrice
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type == "rent" && " / month"}
          </p>

          <div className="flex item-center space-x-3 mt-[10px] ">
            <div className="flex item-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedroom > 1 ? `${listing.bedroom} Beds` : `1 Bed`}
              </p>
            </div>
            <div className="flex item-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathroom > 1 ? `${listing.bathroom} Baths` : `1 Bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {onDelete && (
        <TbTrashXFilled
          className="pointer text-red-600 h-[14px] cursor-pointer absolute right-2 bottom-2"
          onClick={() => onDelete(listing.id)}
        />
      )}

      {onEdit && (
        <FaEdit
          className="pointer text-black h-4 cursor-pointer absolute right-8 bottom-2"
          onClick={() => onEdit(listing.id)}
        />
      )} 
    </li>
  );
}
