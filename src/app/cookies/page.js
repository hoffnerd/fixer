
import { cookies } from 'next/headers'

export default function Page() {
    const cookieStore = cookies()

    console.log("Am I client or server?") // server, see what happens when you make this a client component

    return cookieStore.getAll().map((cookie) => <>
        <hr/>
        <div key={cookie.name}>
            <p>Name: {cookie.name}</p>
            <p>Value: {cookie.value}</p>
        </div>
    </>)
}