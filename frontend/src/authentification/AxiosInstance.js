import axios from 'axios';

const AxiosManager = (setUser) => {
const AxiosInstance = axios.create({
    baseURL: 'http://localhost:4000' /* http://application.local */ 
})

AxiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization =  token;

    return config;
});

AxiosInstance.interceptors.response.use((response) =>{
    return(
        new Promise((resolve, reject)=>{
            resolve(response)
        })
    )
    
},( error) =>{
    if (!error.response){
        return (
            new Promise((resolve, reject)=>{
                reject(error)
            })

        )

    }

    if (error.response.status=== 403){
        
        localStorage.removeItem("token");
        if(setUser){
            setUser({isLoggedIn: false, role: ''});
        }

        return (
            new Promise((resolve, reject)=>{
                reject(error)
            })

        )
        
    }
    else{
        return (
            new Promise((resolve, reject)=>{
                reject(error)
            })

        )

    }
    
}

)

return AxiosInstance;

}

export default AxiosManager;