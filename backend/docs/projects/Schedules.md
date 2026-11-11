1. Cấu hình Rate Limit cho api login

- Yêu cầu:

+ Chỉ đc sai không quá 3 lần -> Nếu vi phạm: Khóa trong 1 phút


- Với yêu cầu 2:

+ Ko liên quan đến rate limit

+ Lưu theo thiết bị: Cần tham khảo

+ Storage: Memory || DB

{id: {
    expriedAt

}}

+ Logic ktra

 -> Check trong storage

 -> Phù hợp thì cho qua đến bước tiếp theo

 -> Bị lỗi thì báo lỗi luôn



- Hướng cho yêu cầu 2:

+ Check theo: IP + email:

  -> Tránh đổi IP để spam tiếp

  -> Nếu chỉ IP: Các người dùng trong cùng 1 IP sẽ bị ảnh hưởng

  -> Nếu chỉ email: Người khác có thể tấn công email của user thật

+ Điều kiện: 3 lần trong 1 ngày

+ Lưu trong RAM

+ Ko cần sử dụng thư viện nào cả

2 Logic:

- Ktra xem email + IP có đang bị vi phạm hay không?

+ Có -> Trả về lỗi luôn

+ Không -> Tiếp tục

- Email || Password bị sai -> Tăng lên 1 + Trả về lỗi

- Thành công -> Xóa

- Vấn đề xóa dữ liệu thừa khi hết thời gian:

+ Xóa ngay tại hàm login -> Khi kiểm tra và phát hiện thời gian đã hết

+ Định kỳ xóa 1 lần trong ngày