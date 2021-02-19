const API_URL = process.env.NODE_ENV === 'development' ?  'http://localhost:4001/graphql':'https://grand-stack-backend.prodevs.vercel.app/graphql' /* 'http://api.medikon.com.br:4001/graphql'  */;

export default API_URL;
