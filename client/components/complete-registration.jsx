"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Successful from "./Successful";

const fields = [
  {
    label: "First Name",
    placeholder: "Enter your full name",
    id: "firstName",
  },
  {
    label: "Last Name",
    placeholder: "Enter your full name",
    id: "lastName",
  },
  {
    label: "Email",
    placeholder: "Enter your email address",
    id: "email",
  },
  {
    label: "Stage Name",
    placeholder: "Enter your stage name",
    id: "stageName",
  },
];

const socialMediaOptions = [
  { value: "facebook", label: "facebook" },
  { value: "instagram", label: "instagram" },
  { value: "tiktok", label: "tikTok" },
];

const completeRegistration = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValidation, setFormValidation] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    stageName: "",
    entrySocialPost: "",
    socialMediaHandle: "",
    socialMediaPlatform: "",
    profileImage: "",
    entryImage: "",
    comment: "",
    termsAccepted: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [loading, setLoading] = useState(false);
  

  // Fetch email from URL query parameters on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setFormValues((prevState) => ({
        ...prevState,
        email: emailParam,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Values:", formValues);

    setSubmitted(true);

    const isValid = validateForm(formValues);
    if (!isValid) {
      console.error("Form validation failed");

      return;
    }

    setLoading(true);

    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiURL = `${apiBaseURL}/complete-registration`;

    const formData = new FormData();

    formData.append("email", formValues.email);
    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("stageName", formValues.stageName);
    formData.append("entrySocialPost", formValues.entrySocialPost);
    formData.append("socialMediaHandle", formValues.socialMediaHandle);
    formData.append("socialMediaPlatform", formValues.socialMediaPlatform);
    formData.append("comment", formValues.comment);
    formData.append("termsAccepted", formValues.termsAccepted);

    if (formValues.profileImage) {
      formData.append("profileImage", formValues.profileImage);
    }
    if (formValues.entryImage) {
      formData.append("entryImage", formValues.entryImage);
    }

    try {
      const response = await axios.post(apiURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`Registration successful: ${JSON.stringify(response.data)}`);
      setShowConfirmation(true);
    } catch (error) {
      const errorMessage = error.response
        ? JSON.stringify(error.response.data)
        : error.message;
      console.error(`Error submitting registration: ${errorMessage}`);
      setErrorLog(errorMessage);
    } finally {
      setLoading(false); // Set loading to false once submission is complete
    }
  };
  
  const validateForm = (values) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
  
    if (!emailRegex.test(values.email)) {
      isValid = false;
      console.log("Invalid email:", values.email);
    }
    if (values.firstName.trim() === "") {
      isValid = false;
      console.log("First name is empty");
    }
    if (values.lastName.trim() === "") {
      isValid = false;
      console.log("Last name is empty");
    }
    if (values.stageName.trim() === "") {
      isValid = false;
      console.log("Stage name is empty");
    }
    if (values.entrySocialPost.trim() === "") {
      isValid = false;
      console.log("Social post is empty");
    }
    if (values.socialMediaHandle.trim() === "") {
      isValid = false;
      console.log("Social handle is empty");
    }
    if (!selectedValue) {
      isValid = false;
      console.log("Social media is not picked");
    }
    if (!values.profileImage) {
      isValid = false;
      console.log("upload image");
    }
    if (!values.entryImage) {
      isValid = false;
      console.log("upload entry image");
    }
    if (!values.termsAccepted) {
      isValid = false;
      console.log("Terms not accepted");
    }
  
    return isValid;
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === "file" && files.length > 0) {
      const file = files[0];
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, and JPEG files are allowed.");
        return; // Exit and do not update state
      }

      if (file.size > 1024 * 1024) {
        // File size greater than 1MB
        alert("File size must not exceed 1MB.");
        return; // Exit and do not update state
      }

      setFormValues((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSocialMediaSelect = (event) => {
    setSelectedValue(event);
    setFormValues((prevState) => ({
      ...prevState,
      socialMediaPlatform: event,
    }));
  };



  return (
    <div
      className="outer_card"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(14px)",
      }}
    >
      {!showConfirmation ? (
        <Card className="card">
          <CardHeader>
            <CardTitle className="head_text w-auto sm:w-[484px]">
              Join Nyeusi Music Competition
            </CardTitle>
            <CardDescription className="head_para">
              Begin your journey by entering your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center place-content-start gap-4 text-white">
                  {fields.map((field, index) => (
                    <div key={index} className="flex flex-col space-y-1.5">
                      <Label htmlFor={field.id} className="label">
                        {field.label}
                      </Label>
                      <Input
                        id={field.id}
                        name={field.id}
                        placeholder={field.placeholder}
                        className="input"
                        value={formValues[field.id]} // Corrected: Use field.id
                        helperText={
                          formValidation[field.id]
                            ? ""
                            : `Please provide a valid ${field.label.toLowerCase()}`
                        }
                        onChange={handleChange}
                        readOnly={field.id === "email"} // Make email non-editable
                      />
                      {submitted && !formValues[field.id] && (
                        <span className="error_log">
                          Please provide a valid {field.label.toLowerCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="entrySocialPost" className="label">
                    Enter link to social media post
                  </Label>
                  <Input
                    id="entrySocialPost"
                    name="entrySocialPost"
                    placeholder="Enter your social post"
                    className="input "
                    value={formValues.entrySocialPost}
                    onChange={handleChange}
                  />
                  {submitted && !formValues.entrySocialPost && (
                    <span className="error_log">
                      Please provide a social post link
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center place-content-start gap-4 text-white">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="socialMediaHandle" className="label">
                      Social Media Handle
                    </Label>
                    <Input
                      id="socialMediaHandle"
                      name="socialMediaHandle"
                      placeholder="Enter your social media handle"
                      className="input"
                      value={formValues.socialMediaHandle}
                      onChange={handleChange}
                    />
                    {submitted && !formValues.socialMediaHandle && (
                      <span className="error_log">
                        Please provide a valide social media handle
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="socialMediaPlatform" className="label ">
                      Social Media Platform
                    </Label>
                    <Select
                      onValueChange={(event) => handleSocialMediaSelect(event)}
                    >
                      <SelectTrigger className=" input">
                        <SelectValue
                          placeholder="Select the social media plaform used"
                          className="text-slate-300"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {/* <SelectLabel className="text-slate-300">
                            Social Handle
                          </SelectLabel> */}

                          {socialMediaOptions.map((social, i) => (
                            <SelectItem key={i} value={social.label}>
                              {social.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {submitted && !formValues.socialMediaPlatform && (
                      <span className="error_log">
                        Please select a social media platform
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center place-content-start gap-4 text-white">

                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="picture" className="label">
                      Upload Your Profile Picture
                    </Label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={handleChange}
                    />
                    {submitted && !formValues.profileImage && (
                      <span className="text-red-500 text-xs mt-1">
                        Please upload a profile Image
                      </span>
                    )}
                  </div>


                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="picture" className="label">
                     Upload a Screenshot of your Entry Post
                    </Label>
                    <Input
                      id="entryImage"
                      name="entryImage"
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={handleChange}
                    />
                    {submitted && !formValues.entryImage && (
                      <span className="error_log">
                        Please upload an entry Image
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message" className="label">
                    Comment
                  </Label>
                  <Textarea
                    placeholder="Provide any additional comment that you think might be useful here."
                    id="message"
                    className="input"
                    name="comment"
                    value={formValues.comment}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    className="text-slate-400 rounded-[4px] border-slate-300"
                    checked={formValues.termsAccepted}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-regular cursor-pointer text-red-400 font-mont"
                  >
                    <a href="https://nyeusi.org/terms-and-conditions/">
                      Accept Terms and Conditions
                    </a>
                  </label>

                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="notice" className="label">
                    Notice
                  </Label>
                  <textarea
                    id="notice"
                    className="input w-full bg-white border border-gray-300 rounded-md p-3 text-slate-600"
                    readOnly
                    rows={5} // Adjust the number of rows to match the text size
                    style={{ height: "auto", overflow: "hidden" }} // Prevent scrolling
                    value={`Please make sure you're following us before registering, otherwise log in to your social media account and follow us. After following, return in 24 hours to allow our system time to update the follower list. Don't forget to use the compulsory hashtags. Please see the competition page for more details.`}
                  />
                  <span className="text-sm font-regular cursor-pointer text-red-400 font-mont">
                    <a href="https://nyeusi.org/give-black-december/" target="_blank">
                      &nbsp;Click here to read the Competition rules&nbsp;
                    </a>
                  </span>
                </div>


              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col justify-between">
          <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="yellow_btn w-full mb-2"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? "Submitting..." : "Continue"} {/* Show "Submitting..." when loading */}
                </Button>
                {errorLog && (
                  <div
                    className="log error_log text-red-500 mt-2"
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {errorLog}
                  </div>
                )}
                
          </CardFooter>
        </Card>
      ) : (
        <Successful />
      )}
    </div>
  );
};

export default completeRegistration;