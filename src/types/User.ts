export type User = {
    name: string;
    email: string;
    password: string; // Optional if using Google sign-in
    googleId: string;
};