import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  // This part should theoretically not be reached due to middleware,
  // but serving as a fallback and for static optimization.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#faf1e3' }}>
      <p style={{ fontFamily: 'Inria Serif', fontSize: '1.2rem' }}>Taking you to your notes...</p>
    </div>
  );
}
