import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";

const socialIcons = [
  {
    instagram: "instagrams.svg",
    tiktok: "tiktoks.svg",
    facebook: "facebooks.svg ",
    entryPost: "link.svg ",
    email: "gmail.svg",
  },
];

const ParticipantInfo = ({
  handleClose,
  selectedParticipant,
  handleApprove,
  handleDecline,
}) => {
  // Function for handling approval
  return (
    <div>
      <Card className="card">
        <CardHeader className="bg-yellow-200 rounded-t-xl mb-4">
          <div className="flex justify-between ">
            <CardTitle className="font-lg text-slate-900 font-mont w-auto sm:w-[484px]">
              Product Details
            </CardTitle>
            <img
              src="/assets/icons/close.svg"
              alt="menu"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
        </CardHeader>

        <CardContent className="flex gap-8">
          <div className="">
            <img
              src={`http://localhost:8080/${selectedParticipant?.profileImage}`}
              alt="image"
              className="inline-block h-28 w-28 ring-2 ring-white object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <p className="text-base font-semibold">Product Name:</p>
                <p>{selectedParticipant?.firstName}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-base font-semibold">Price:</p>
                <p>{selectedParticipant?.lastName}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-base font-semibold">Description:</p>
                <p>{selectedParticipant?.stageName}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-base font-semibold">Manufacturer:</p>
                <p>{selectedParticipant?.socialMediaHandle}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-base font-semibold">Reviews:</p>
                <p>{selectedParticipant?.voteCount}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-base font-semibold">Comment:</p>
                <p>{selectedParticipant?.comment}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="rounded-[8px] border bg-green-600 py-2 px-8 text-white transition-all text-base cursor-pointer font-mont"
                onClick={() => {
                  handleApprove(selectedParticipant?._id);
                  handleClose();
                }}
              >
                In Stock
              </button>
              <button
                className="rounded-[8px] bg-red-700 py-2 px-8 text-white transition-all text-base cursor-pointer font-mont"
                onClick={() => {
                  handleDecline(selectedParticipant?._id);
                  handleClose();
                }}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantInfo;
