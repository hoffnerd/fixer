
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import CardContract from "@/components/CardContract";



//______________________________________________________________________________________
// ===== Component  =====
export default function Contracts(){

    return <>
        <h1 className="text-xl">Core Contracts</h1>
        <div className="py-2"/>
        <div className={styles.contractsGrid}>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
        </div>
        <div className="py-8">
            <div className="border-2 neonBorder neonBoxShadowGlow yellow"/>
        </div>
        <h1 className="text-xl">Regular Contracts</h1>
        <div className="py-2"/>
        <div className={styles.contractsGrid}>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
            <CardContract title="Wanna be Corpo" description="Neutralize Llan Onishi"></CardContract>
            <CardContract title="Lux's Past" description="Intel Gathering for Lux Quartz"></CardContract>
        </div>
    </>
}