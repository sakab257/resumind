import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import ResumeCard from "~/components/resume-card";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Feedback intelligent pour votre future carrière!" },
  ];
}

export default function Home() {
  const {auth} = usePuterStore();
  const navigate = useNavigate();

    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated])
    
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Suivez vos candidatures & notez vos CVs</h1>
        <h2>Examinez vos CVs et recevez un feedback fait par une IA !</h2>
      </div>
    </section>
    {resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    )}
    
    
  </main>;
}
