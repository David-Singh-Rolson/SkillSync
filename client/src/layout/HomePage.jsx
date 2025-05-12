// pages/HomePage.jsx
import React, { useEffect } from "react";
import HeroSection from "../pages/student/HeroSection"
import RecommendedCourses from "../pages/student/RecommendedCourses";
import Assessments from "../pages/student/Assessments";
import Courses from "../pages/student/Courses";
import { useLoadUserQuery } from "../features/api/authApi";
import { Loader2 } from "lucide-react";
import { useGetUserRecommendationsQuery } from "@/features/api/recommendationApi";


const HomePage = () => {
  const { data, isLoading,refetch } = useLoadUserQuery();
  const {data:recommendationdata,isSuccess,isError}=useGetUserRecommendationsQuery()
 
  


useEffect(() => {
  refetch();
  if (isLoading) {
        return <Loader2/>
  }
}, [data])

  

  return (
    <>
      <HeroSection />
      {data?.user?.role === "student" && <RecommendedCourses  recommendationdata={recommendationdata}/>}
      <Assessments role={data?.user?.role} />
      <Courses />
    </>
  );
};

export default HomePage;
