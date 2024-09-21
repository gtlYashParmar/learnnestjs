export interface User {
    id: string;
    mobileNumber: string;
    name: string;
    photo?: string;
    currency: string;
    role: 'admin' | 'user';
    otp?: string;
    otpExpiration?: Date;
}