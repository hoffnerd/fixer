"use client"

import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

export default function SessionClient() {
    const { session } = useSession();

    useEffect(() => {
        if (process.env.NODE_ENV === "production") return;
        console.log({ trace:"SessionClient", session });
    }, [session])

    return <></>;
}