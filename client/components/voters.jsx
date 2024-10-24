"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const socialMediaOptions = [
  { value: "facebook", label: "facebook" },
  { value: "instagram", label: "instagram" },
  { value: "tiktok", label: "tikTok" },
];

const VotersHandle = ({ handleClose, participantId }) => {
  const [formValues, setFormValues] = useState({
    voterHandle: "",
    voterPlatform: "",
    participantId: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const handleVote = async (e) => {
    e.preventDefault();

    console.log("Form Values:", formValues);

    setSubmitted(true);

    const isValid = validateForm(formValues);
    if (!isValid) {
      console.error("Form validation failed");
      return;
    }

    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiURL = `${apiBaseURL}/vote`;

    const voteData = {
      voterHandle: formValues.voterHandle,
      voterPlatform: formValues.voterPlatform,
      participantId: participantId,
    };

    try {
      const response = await axios.post(apiURL, voteData);

      // Log the entire response object to see its structure
      console.log("API Response:", response);

      if (response.data && response.data.message) {
        console.log("Voting successful:", response.data.message);
      } else {
        // Handle unexpected response structure
        console.error("Unexpected API response structure:", response);
      }

      handleClose(); // close the modal
    } catch (error) {
      setError(error);
      console.error(`Error submitting vote:`, error.response.data);
    }
  };

  useEffect(() => {
    const fetchParticipantId = async () => {
      const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const apiURL = `${apiBaseURL}/participant`;
      try {
        const response = await axios.get(apiURL);
        console.log("Participant data:", response.data);
        if (response.data.length > 0) {
          setParticipantId(response.data[0]._id);
        } else {
          console.error("No participants found.");
        }
      } catch (error) {
        console.error("Error fetching participant ID:", error);
      }
    };

    fetchParticipantId();
  }, []);

  const validateForm = (values) => {
    let isValid = true;

    if (values.voterHandle.trim() === "") {
      isValid = false;
      console.log("Social handle is empty");
    }
    if (!values.voterPlatform) {
      isValid = false;
      console.log("Social media is not selected");
    }
    return isValid;
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const closeHandle = () => {
    handleClose();
  };

  const handleSocialMediaSelect = (event) => {
    setSelectedValue(event);
    setFormValues((prevState) => ({
      ...prevState,
      voterPlatform: event,
    }));
  };
  return (
    <div
      className="p-[12px] rounded-xl shadow-2xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Card className="card">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="head_text w-auto sm:w-[484px]">
              Vote Participants
            </CardTitle>
            <img
              src="/assets/icons/close.svg"
              alt="menu"
              width={32}
              height={32}
              className="cursor-pointer"
              onClick={closeHandle}
            />
          </div>
          <CardDescription className="head_para">
            Enter your preferred social Handle to vote your favorite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="voterPlatform" className="label">
                  Social Media Platform
                </Label>
                <Select
                  onValueChange={(event) => handleSocialMediaSelect(event)}
                >
                  <SelectTrigger className=" input">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Social Handle</SelectLabel>

                      {socialMediaOptions.map((social, i) => (
                        <SelectItem key={i} value={social.label}>
                          {social.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {submitted && !formValues.voterPlatform && (
                  <span className="error_log">
                    Please select a social media platform
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="label">
                  Social Media Handle
                </Label>
                <Input
                  type="text"
                  id="voterHandle"
                  name="voterHandle"
                  placeholder="Enter your social media handle"
                  className="input "
                  value={formValues.voterHandle.toLocaleLowerCase()}
                  onChange={handleChange}
                />
                {submitted && !formValues.voterHandle && (
                  <span className="error_log">
                    Please select a social media platform
                  </span>
                )}

                  <div className="grid w-full gap-1.5">
                  <Label htmlFor="notice" className="label">
                    Notice
                  </Label>
                  <textarea
                    id="notice"
                    className="input w-full bg-white border border-gray-300 rounded-md p-3 text-slate-600"
                    readOnly
                    rows={3} // Adjust the number of rows to match the text size
                    style={{ height: "auto", overflow: "hidden" }} // Prevent scrolling
                    value={`Please make sure you're following us before registering, otherwise log in to your social media account and follow us before registering. After following, return in 24 hours to allow our system time to update the follower list.`}
                  />
                </div>


                {error && (
                  <span className="error_log">
                    {error.response &&
                    error.response.data &&
                    error.response.data.message
                      ? error.response.data.message
                      : "Error submitting vote"}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            className="yellow_btn w-full"
            onClick={handleVote}
          >
            Vote
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VotersHandle;
