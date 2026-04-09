interface User {
    company: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UserInfoProps {
    user: User;
}

export default function UserInfo( {user}  : UserInfoProps) {
    return (
        <div style={{ marginBottom: 30 }}>
            <h2>
                {user.first_name} {user.last_name}
            </h2>
            <p>{user.company}</p>
            <p>{user.email}</p>
        </div>
    );
}
