"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VotersHandle from "./voters";

const VoteCard = () => {
  const [showHandle, setShowHandle] = useState(false);
  const [data, setData] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  const [requestLog, setRequestLog] = useState("");
  const [responseLog, setResponseLog] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);

  const handleVote = (participantId) => {
    console.log("Voting for Participant ID:", participantId); // Log the Participant ID
    setSelectedParticipantId(participantId);
    setShowHandle(true);
  };

  const handleClose = () => {
    setShowHandle(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const apiURL = `${apiBaseURL}/participant`;

      try {
        const response = await axios.get(apiURL);
        setResponseLog(`Participants data: ${JSON.stringify(response.data)}`);

        const fullyRegistered = response.data.filter(
          (participant) => participant.isFullyRegistered
        );
        setData(fullyRegistered);
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error.response
          ? JSON.stringify(error.response.data)
          : error.message;
        setErrorLog(errorMessage);
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full flex justify-center">
      {isloading ? (
        <p className="text-white">Loading.....</p>
      ) : errorLog ? (
        <p className="text-red-600">Error: {errorLog}.....</p>
      ) : (
        <div className="flex justify-center flex-wrap gap-12">
          {data.map((participant, i) => (
            <Card
              className="bg-white lg:w-[235px] w-auto rounded-xl flex-col justify-between"
              key={i}
            >
              {/* Your card content */}
              <CardHeader className="px-0 pt-0 pb-0" key={i}>
                <img
                  src={`http://localhost:8080/${participant.profileImage}`}
                  alt={participant.firstName}
                  className="object-cover rounded-t-xl w-[300px] h-[175px]"
                />
                <CardDescription className="sm:w-[235px] w-full text-base font-semibold font-mont px-2 pt-2">
                  {participant.stageName}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-col justify-between px-2 pt-0 pb-0">
                <p className="text-sm">{participant.totalVotes} votes</p>
              </CardContent>

              <CardFooter className="px-2 pt-4 pb-2 flex gap-2">
                <a
                  href={participant.entrySocialPost}
                  className="outline_btn w-1/2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>

                <a
                  className="yellow_btn w-1/2"
                  onClick={() => handleVote(participant._id)}
                >
                  Vote
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {showHandle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <VotersHandle
            handleClose={handleClose}
            participantId={selectedParticipantId}
          />
        </div>
      )}
    </div>
  );
};

export default VoteCard;
