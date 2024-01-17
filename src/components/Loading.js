import styles from "@/styles/components/Loading.module.css";

/**
 * Displays a loading animation
 * @prop {string} style String indicating which loading animation to show
 */
const Loading = ({ style="bars", theme="light" }) => {

    const renderLoader = (style) => {
         if (style === "quarter-spinner") {
            return (
                <div className="tw-relative">
                    <div className={`${styles.quarterSpinner} ${styles[`${theme}ThemeQuarterSpinner`]}`} />
                </div>
            );
        } else if (style === "dots") {
            return (
                <div className={`${styles.dots} ${styles[`${theme}ThemeDots`]}`}>
                    <div/>
                    <div/>
                    <div/>
                </div>
            );
        }
        return (
            <div className={`${styles.bars} ${styles[`${theme}ThemeBars`]}`}>
                <div/>
                <div/>
                <div/>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {renderLoader(style)}
            <p className={styles[`${theme}ThemeText`]}>Loading...</p>
        </div>
    );
};

export default Loading;