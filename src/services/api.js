const API_URL = process.env.NODE_ENV === 'developmen' ?  'http://localhost:4001/graphql': 'http://api.medikon.com.br:4001/graphql' /* 'https://grand-stack-backend.prodevs.vercel.app/graphql' */;

export default API_URL;
