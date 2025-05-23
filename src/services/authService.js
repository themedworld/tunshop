
 import axiosInstance from "../axios/axiosInstance";
 import jwt_decode  from 'jwt-decode';
 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

 const setToken = (token) => {
        localStorage.setItem('token' ,token);
 };


 const getToken = ()=> {
    const token = localStorage.getItem('token');
    if(token){
        return token;
    }
    return null;
 }
const getUserId = () => {
  return localStorage.getItem('userid');
};
const getProductId = () => {
  return localStorage.getItem('ProductId');
};
const getorderId = () => {
  return localStorage.getItem('orderid');
};
 const login = (userData) => {
    return axiosInstance.post(`${API_BASE_URL}/api/v1/users/signin`, userData);
 }


 const getUserName = () => {
    const token = getToken();
    if(token){
        const payLoad = jwt_decode(token);
        return payLoad?.username;
    }
    return null;
 }

 const getUserRole = () => {
    const token = getToken();
    if(token){
        const payLoad = jwt_decode(token);
        return payLoad?.role;
    }
    return null;
 }

 const isLoggedIn = () => {
    const token = getToken();
    if(token){
        const payLoad = jwt_decode(token);
        const isLogin = Date.now() < payLoad.exp * 1000;
        return isLogin;

    }
 }

 const logOut = ()=> {
    localStorage.clear();
 }


 export  const authService = { logOut, setToken, login, getUserName, getUserRole, isLoggedIn,getUserId,getProductId,getorderId };