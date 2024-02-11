export const defaultSaveData = {

    resources:{
        e: 1000, // Euro Dollars
        w: 5, // Weapon Components
        t: 5, // Tech Components
        q: 5, // Quickhack Components
    },
    
    chapter: 0,

    // n = news articles | 
    // 0 = not yet achieved | 1 = achieved but not yet read | 2 = achieved and read
    // articles: [ 0, 0, 0, 1, ],
    articles: {
        a_0: 0
    },

    // Bucket to show items in notifications panel in the order you achieved them.
    // No need to manually edit as there is process that will catch anything that is supposed to be here.
    notifications: []
}