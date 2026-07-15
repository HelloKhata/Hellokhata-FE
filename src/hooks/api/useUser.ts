import { forgotPassword, loginUser, registerUser, resendOTP, resetPassword, verifyForgetOTP, verifyOTP } from "@/services/user.services"
import { useMutation } from "@tanstack/react-query"

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser
    })
};


export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: verifyOTP
    })
};


export const useResendOTP = () => {
    return useMutation({
        mutationFn: resendOTP
    })
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUser
    })
}


export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword
    })
}


export const useVerifyForgetOTP = () => {
    return useMutation({
        mutationFn: verifyForgetOTP
    })
}


export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword
    })
}