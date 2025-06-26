import HeaderBar from "../HeaderBar/HeaderBar";
import ProfilePhotoField from "./ProfilePhotoField";
import EditInfoSection from './EditInfoSection';

// import UserInfo from "./UserInfo";

export default function UserSettings(props)
{

    const userId = localStorage.getItem('userId');
    console.log(userId)
    return (
        <div>
        <HeaderBar/>
        <ProfilePhotoField />
         <EditInfoSection />
        {/* <UserInfo userInfo={props.userInfo}/> */}
        </div>
        
    )
}