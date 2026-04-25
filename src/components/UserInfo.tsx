import {User, UserInfoProps} from "./userProps.interface";

export default function UserInfo( {user}  : UserInfoProps) {
    let u: User = {company: "", first_name: "", last_name: "", email:""};
    if(user.length > 0){
        u = user[0];
    }
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <h2>
                    <b>{u.first_name} {u.last_name}</b>
                </h2>
                <p style={{fontSize: "30px"}}>&nbsp;/&nbsp;{u.company}</p>
            </div>
        </div>
    );
}
