import { jwtDecode } from "jwt-decode";
import "../../static/css/bottom.css";

function UserInfo({ user, logoutEvent }) {
  const realUser = jwtDecode(user);

  const logout = () => {
    if (logoutEvent !== undefined) {
      logoutEvent();
    }
  };

  return (
    <div className="user-info">
      <img
        src="svg/user-icon.svg"
        alt="User Icon"
        className="user-icon"
        onClick={logout}
      />
      <span className="username">{user.username}</span>
      <span className="status">활동중</span>
      <span className="status-dot on"></span>
    </div>
  );
}
export default UserInfo;
