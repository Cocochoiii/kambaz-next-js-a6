"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push("/Account/Profile");
        } else {
            router.push("/Account/Signin");
        }
    }, [currentUser, router]);

    return null; // Return null while redirecting
}