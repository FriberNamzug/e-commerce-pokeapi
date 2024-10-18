import axiosInstance from "@/utils/axios";

export async function registrarService({
    name,
    email,
    password,
    password_confirmation
}) {
    const response = await axiosInstance.post('/api/registro', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
    })

    return response
}


export async function loginService({ email, password }) {
    const response = await axiosInstance.post('/api/login', {
        email: email,
        password: password
    })
    return response
}


export async function logoutService() {
    const response = await axiosInstance.post('/api/logout')
    return response
}