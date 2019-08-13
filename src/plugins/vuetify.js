import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


export default new Vuetify(
    {
        icons: {
            iconfont: 'mdi', // default - only for display purposes
        },
        theme: {
            primary: '#81d4fa',
            primary_light: '#b6ffff',
            primary_dark: '#4ba3c7',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107'
        }
    }
)
