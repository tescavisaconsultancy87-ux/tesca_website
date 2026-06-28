import { supabase } from "./supabase";

// Authenticate session cookie — uses Supabase Auth + admins table only
export async function checkAdminAuth(cookies: any): Promise<boolean> {
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  
  if (accessToken && refreshToken) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!error && user && user.email) {
        // Query database to see if user is allowlisted as admin
        const { data: adminRecord, error: dbError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        if (!dbError && adminRecord) {
          return true;
        }
      }
    } catch (err) {
      console.error("Supabase getUser failed:", err);
    }
  }

  return false;
}

