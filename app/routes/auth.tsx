import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta =() => ([
    { title: 'Resumind | Connexion'},
    { name: "description", content: "Page de connexion"}
])

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    useEffect(()=>{
        if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next])

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1>Bienvenue</h1>
                    <h2>Connectez Vous Pour Continuer Votre Job Hunting</h2>
                </div>
                <div className="flex items-center justify-center">
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Connexion ...</p>
                        </button>
                    ): (
                        <>
                        {auth.isAuthenticated ? (
                            <button className="auth-button" onClick={auth.signOut}>
                                <p>Deconnexion</p>
                            </button>
                        ) : (
                            <button className="auth-button" onClick={auth.signIn}>
                                <p>Connexion</p>
                            </button>
                        )}
                        </>
                    )}
                </div>
            </section>

        </div>
    </main>
  )
}

export default Auth