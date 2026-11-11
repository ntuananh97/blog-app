"use client";

import { httpRequest } from "@/lib/httpRequest";
import { saveRefreshTokenToCookie, saveTokenToCookie, saveUserInfoToCookies } from "@/lib/utils";
import { ILoginResponse } from "@/types/user.type";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from 'next/navigation';

// Giả sử bạn có hook hoặc hàm xử lý lưu token hiện tại
// import { saveTokens } from "@/utils/auth";

export default function GoogleLoginButton({onLoading}: {onLoading: (val: boolean) => void}) {
    const router = useRouter();
  
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const idToken = response.credential;
      if (!idToken) return;

      // Gọi API xuống NestJS Backend
      console.log("🚀 ~ handleGoogleSuccess ~ idToken:", idToken)
      onLoading(true)

      const data = await httpRequest.post<ILoginResponse>("/auth/login-social", {
        tokenID: idToken,
        provider: "google",
      });

      // Backend trả về accessToken và refreshToken
      // Thực hiện lưu trữ tương tự như đăng nhập bằng username/password
      console.log("Tokens from backend:", data);

       const token = data.accessToken;
            saveTokenToCookie(token);
            const refreshToken = data.refreshToken;
            saveRefreshTokenToCookie(refreshToken);
            const userInfo = data.user;
            saveUserInfoToCookies(userInfo);

       // Refresh server components to reflect the new session state
      router.refresh();

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
    }
    finally {
      onLoading(false)
    }
  };

  const handleGoogleFailure = () => {
    console.error("Người dùng đóng popup hoặc có lỗi từ phía Google");
  };

  return (
    <div className="flex justify-center my-4">
      <GoogleLogin
      
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        useOneTap={false} // Bật true nếu muốn hiển thị popup OneTap của Google ở góc màn hình
      />
    </div>
  );
}
