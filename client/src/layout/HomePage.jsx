// pages/HomePage.jsx
import React, { useEffect } from "react";
import HeroSection from "../pages/student/HeroSection"
import RecommendedCourses from "../pages/student/RecommendedCourses";
import Assessments from "../pages/student/Assessments";
import Courses from "../pages/student/Courses";
import { useLoadUserQuery } from "../features/api/authApi";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const { data, isLoading,refetch } = useLoadUserQuery();
// console.log(data.user.role);

useEffect(() => {
  refetch();
  if (isLoading) {
        return <Loader2/>
  }
}, [data])

  

  return (
    <>
      <HeroSection />
      {data?.user?.role === "student" && <RecommendedCourses />}
      <Assessments role={data?.user?.role} />
      <Courses />
    </>
  );
};

export default HomePage;
