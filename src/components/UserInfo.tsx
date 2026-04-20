import {User, UserInfoProps} from "./userProps.interface";

export default function UserInfo( {user}  : UserInfoProps) {
    let u: User = {company: "", first_name: "", last_name: "", email:""};
    if(user.length > 0){
        u = user[0];
    }
    return (
        <div style={{ marginBottom: 20 }}>
            <h2>
                <b>{u.first_name} {u.last_name}</b>
            </h2>
            <p>{u.company}</p>
        </div>
    );
}
