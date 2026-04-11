interface User {
    company: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UserInfoProps {
    user: User[];
}

export default function UserInfo( {user}  : UserInfoProps) {
    let u: User = {company: "", first_name: "", last_name: "", email:""};
    if(user.length > 0){
        u = user[0];
    }
    return (
        <div style={{ marginBottom: 30 }}>
            <h2>
                <b>{u.first_name} {u.last_name}</b>
            </h2>
            <p>{u.company}</p>
            <p>{u.email}</p>
        </div>
    );
}
