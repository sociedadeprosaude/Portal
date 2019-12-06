export default {
  TOKEN_STATUS_VALID: 'valid',
  PAYMENT_METHODS: {
    debit: {
      name: 'Débito',
      INITIAL_TAX:0.0299,
      PARCEL_TAX: 0,
    },
    credit: {
      name: 'Crédito',
      INITIAL_TAX:0.0314,
      PARCEL_TAX: 0.006,
    },
    money: {
      name: 'Dinheiro',
      INITIAL_TAX:0,
      PARCEL_TAX: 0,
    }
  },

  FIREBASE_CONFIG: {
    apiKey: "AIzaSyCdvs5C8J_t9WPQlcZGuuLJ57hwM9_s9BQ",
    authDomain: "prosaude-36f66.firebaseapp.com",
    databaseURL: "https://prosaude-36f66.firebaseio.com",
    projectId: "prosaude-36f66",
    storageBucket: "prosaude-36f66.appspot.com",
    messagingSenderId: "86942539576",
    appId: "1:86942539576:web:9bf02a0a4d8e94b9"
  }

}
