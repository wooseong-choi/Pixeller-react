// api/login.jsx
import { setCookie } from "../components/Cookies.ts";
import { axiosInstance } from "./axios";

const option = {
  Path: "/",
  HttpOnly: true, // 자바스크립트에서의 접근을 차단
  SameSite: "None", // CORS 설정
  Secure: true, // HTTPS에서만 쿠키 전송
  expires: new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 14), // 14일
};

export const login = async (user) => {
  try {
    const response = await axiosInstance.post("/user/login", { user });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // throw error;
  }
};

export const loginS = async (user) => {
  try {
    const response = await axiosInstance.post("/user/login", { user });

    if (response.data === null || response.data === "")
      return alert("로그인이 실패하였습니다.");

    if (response.data.msg === "Ok") {
      if (response.data.jwt) {
        setCookie("refresh_token", response.data.refreshToken, option); // 쿠키 저장
      }
      sessionStorage.setItem("user", response.data.jwt);
      sessionStorage.setItem("username", response.data.user.username);
      return "success";
    } else {
      return alert(response.data.msg);
    }
  } catch (error) {
    console.log(error);
    // return alert("에러가 발생했습니다.");
  }
};

// export const create = async (user) => {
//   return await axios.post("/user/create", { user });
// };
