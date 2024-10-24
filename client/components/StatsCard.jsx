"use client";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance"; // Import the Axios instance

const StatsCard = () => {
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalApprovedEntries, setTotalApprovedEntries] = useState(0);
  const [totalPendingEntries, setTotalPendingEntries] = useState(0);
  const [totalDeclineEntries, setTotalDeclineEntries] = useState(0);
  const [isLoad, stats] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const apiURLTotal = `/total-participant`;
      const apiURLApproved = `/count-approved`;
      const apiURLPending = `/count-pending`;
      const apiURLDeclined = `/count-declined`;

      try {
        const [
          totalParticipantsResponse,
          approvedEntriesResponse,
          pendingEntriesResponse,
          declinedEntriesResponse,
        ] = await Promise.all([
          axiosInstance.get(apiURLTotal),
          axiosInstance.get(apiURLApproved),
          axiosInstance.get(apiURLPending),
          axiosInstance.get(apiURLDeclined),
        ]);

        console.log(
          "Total Participants Response:",
          totalParticipantsResponse.data
        );
        console.log("Approved Entries Response:", approvedEntriesResponse.data);
        console.log("Pending Entries Response:", pendingEntriesResponse.data);
        console.log("Declined Entries Response:", declinedEntriesResponse.data);

        setTotalParticipants(totalParticipantsResponse.data.totalParticipants);
        setTotalApprovedEntries(
          approvedEntriesResponse.data.approvedParticipants
        );
        setTotalPendingEntries(pendingEntriesResponse.data.pendingParticipants);
        setTotalDeclineEntries(
          declinedEntriesResponse.data.declinedParticipants
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Total Products",
      total: totalParticipants,
      icon: "people.svg",
    },
    {
      title: "Available Products",
      total: totalApprovedEntries,
      icon: "tick-circle.svg",
    },
    {
      title: "Shipping",
      total: totalPendingEntries,
      icon: "danger.svg",
    },
    {
      title: "Out of Stock",
      total: totalDeclineEntries,
      icon: "close-circle.svg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center place-content-start gap-4 text-white mb-10">
      {cards.map((card, i) => (
        <div
          className="flex items-start justify-between border-solid border-2 border-slate-600 rounded-xl py-6 px-4"
          key={i}
        >
          <div className="flex-col lg:w-[200px] w-[300px]">
            <h5 className="text-sm font-medium pb-2 font-mont">{card.title}</h5>
            <h1 className="text-3xl font-semibold font-mont">{card.total}</h1>
          </div>
          <img
            src={`/assets/icons/${card.icon}`}
            alt={card.title}
            className="text-white"
          />
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
