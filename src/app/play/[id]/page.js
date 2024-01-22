
// React/Next------------------------------------------------------------------------
// Actions---------------------------------------------------------------------------
import { readSaveFile } from "@/actions/saveFile"
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import Alert from "@/components/Alert";
import NavigationUser from "@/components/NavigationUser";
import { CenterVertically } from "@/components/MicroComponents";
import CardMerc from "@/components/CardMerc";
import CardContract from "@/components/CardContract";
import { Button } from "@/components/shadcn/ui/button";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";
import { renderFontAwesomeIcons } from "@/util/icons";



//______________________________________________________________________________________
// ===== Component  =====
export default async function Page({ params }){

    //______________________________________________________________________________________
    // ===== Constants  =====
    const id = isObj(params, [ 'id' ]) ? params.id : null;
    const saveFile = id ? await readSaveFile(id) : null;



    //______________________________________________________________________________________
    // ===== Render Functions  =====

    // variant="neonYellowWithGlow"
    const renderBottomBarContent = () => (
        <div className="flexItemsEvenly">
            <div>
                <Button>{renderFontAwesomeIcons({ key:"faNewspaper", className:"w-[29px]" })}</Button>
                <Button className="mx-14">{renderFontAwesomeIcons({ key:"faComment", className:"w-[29px]" })}</Button>
            </div>
            <Button>{renderFontAwesomeIcons({ key:"faBook", className:"w-[29px]" })}</Button>
        </div>
    )
    
    const renderMercs = () => <>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
        <div className="p-2"><CardMerc title="Lux Quartz"></CardMerc></div>
        <div className="p-2"><CardMerc title="Hans Boomsmith"></CardMerc></div>
    </>

    const renderContracts = () => <>
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

    const renderResources = () => (
        <div className={styles.resourcesGrid}>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>€ 1000</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>⚙W 5</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>⚙T 5</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} neonBorder blue text-center`}>
                <CenterVertically>⚙Q 5</CenterVertically>
            </div>
        </div>
    )

    const renderNotifications = () => (
        <ul>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><hr/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><div className="border-2 neonBorder neonBoxShadowGlow blue"/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><hr/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
        </ul>
    )


    //______________________________________________________________________________________
    // ===== Component Return  =====

    if(isObj(saveFile, ["error"]) || (!isObj(saveFile, ["id"]))) return (
        <Alert variant="neonRedWithGlow" title="Error!">
            {(saveFile && saveFile.message) || "An unexpected error has occurred!"}
        </Alert>
    )

    return  <>
        <div className="sticky top-0">
            <div className="flexItemsEvenly">
                <div className="p-2 overflow-hidden">{saveFile.name}</div>
                <NavigationUser/>
            </div>
        </div>
        <div className={styles.game}>
            <div className={`${styles.gameGrid} ${styles.desktop} hiddenOnTablet hiddenOnMobile`}>
                <div className={styles.sidebarLeft}>
                    <div className={`${styles.panel} ${styles.notifications} neonBorder neonBoxShadowGlow blue`}>
                        <div className={styles.content}>{renderNotifications()}</div>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow blue`}>
                        {renderResources()}
                    </div>
                    <div className="p-4"/>
                    <div className={`${styles.panel} ${styles.contracts} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                        <div className={styles.content}>{renderContracts()}</div>
                    </div>
                </div>
                <div className={styles.sidebarRight}>
                    <div className={`${styles.panel} ${styles.mercs} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                        <div className={styles.content}>{renderMercs()}</div>
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow white`}>
                        {renderBottomBarContent()}
                    </div>
                </div>
            </div>
            <div className={`${styles.gameGrid} ${styles.tablet} hiddenOnDesktop`}>
                <div className={styles.sidebarLeft}>
                    <div className={`${styles.panel} ${styles.notifications} neonBorder neonBoxShadowGlow blue`}>
                        <div className={styles.content}>{renderNotifications()}</div>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow blue`}>
                        {renderResources()}
                    </div>
                    <div className="p-4"/>
                    <div className={`${styles.panel} ${styles.mercs} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                        <div className={styles.content}>{renderMercs()}</div>
                    </div>
                    <div className="p-4"/>
                    <div className={`${styles.panel} ${styles.contracts} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                        <div className={styles.content}>{renderContracts()}</div>
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow white`}>
                        {renderBottomBarContent()}
                    </div>
                </div>
            </div>
        </div>
</>
} 