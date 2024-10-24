"use client";

import { useState } from "react";
import CompleteRegistration from "@/components/complete-registration";

const Home = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    email: "",
  });

  return (
    <CompleteRegistration/>
  );
};

export default Home;
