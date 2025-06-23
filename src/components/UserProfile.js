import HeaderBar from "./HeaderBar/HeaderBar";


// import UserInfo from "./UserInfo";

export default function UserProfile(props)
{

    const userId = localStorage.getItem('userId');
    console.log(userId)
    return (
        <div>
        <HeaderBar/>
        
        {/* <UserInfo userInfo={props.userInfo}/> */}
        </div>
        
    )
}