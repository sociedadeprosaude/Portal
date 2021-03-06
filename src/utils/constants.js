export default {
    TOKEN_STATUS_VALID: 'valid',
    PAYMENT_METHODS: {
        debit: {
            name: 'Débito',
            INITIAL_TAX: 0.0299,
            PARCEL_TAX: [],
        },
        credit: {
            name: 'Crédito',
            INITIAL_TAX: 0.026,
            PARCEL_TAX: [
                0.0191,
                0.0254,
                0.0317,
                0.0378
            ],
        },
        money: {
            name: 'Dinheiro',
            INITIAL_TAX: 0,
            PARCEL_TAX: [],
        }
    },

    MANAGER_PASSWORD: 'gerentemedikon',
    INTAKE_STATUS: {
        CANCELLED: 'cancelled'
    },
    ASSETS: {
        logo: 'https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2Flogo.svg?alt=media&token=21faf2be-78a2-471d-b045-2c17e26434b4'
    },

    IN_PRODUCTION: process.env.NODE_ENV === 'production',
    FIREBASE_CONFIG: process.env.NODE_ENV === 'development' ?
        {
            apiKey: "AIzaSyCdvs5C8J_t9WPQlcZGuuLJ57hwM9_s9BQ",
            authDomain: "prosaude-36f66.firebaseapp.com",
            databaseURL: "https://prosaude-36f66.firebaseio.com",
            projectId: "prosaude-36f66",
            storageBucket: "prosaude-36f66.appspot.com",
            messagingSenderId: "86942539576",
            appId: "1:86942539576:web:9bf02a0a4d8e94b9"
        }
        :
        {
            apiKey: "AIzaSyCdvs5C8J_t9WPQlcZGuuLJ57hwM9_s9BQ",
            authDomain: "prosaude-36f66.firebaseapp.com",
            databaseURL: "https://prosaude-36f66.firebaseio.com",
            projectId: "prosaude-36f66",
            storageBucket: "prosaude-36f66.appspot.com",
            messagingSenderId: "86942539576",
            appId: "1:86942539576:web:9bf02a0a4d8e94b9"
        }


}
