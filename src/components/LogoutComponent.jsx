import { useRouter} from "next/navigation";
import { useEffect} from "react";

export default function LogoutComponent() {
    const router = useRouter();

    useEffect(()=>{

        const storageData = localStorage.getItem('user');
        const userDetails = JSON.parse(storageData);

        if (userDetails == null) {
            router.push('/');
        } else {
            if (userDetails.user_role === "admin") {
                router.push('/dashboard');
            } else {
                router.push('/user-dashboad');
            }
        }

    },[router])

    return null;
}