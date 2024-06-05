import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";

export default function AuthStack() {
    const {session} = useAuth();
    console.log(session);
    // Redirect to home if user is already logged in
    if (session) {
        return <Redirect href="/"/>
    }
    return <Stack/>
}