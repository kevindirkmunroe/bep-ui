export interface User {
    company: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface UserInfoProps {
    user: User[];
}
