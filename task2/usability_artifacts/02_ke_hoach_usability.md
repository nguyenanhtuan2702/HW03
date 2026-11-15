# Kế hoạch kiểm thử tính khả dụng — EShop Web Admin

## 1. Mục đích
Đánh giá mức độ rõ ràng của điều hướng và phản hồi khi quản trị viên thực hiện tác vụ quản lý danh mục từ giao diện Admin Dashboard. Xác định trở ngại làm chậm, gây thao tác nhầm hoặc giảm sự tự tin; định lượng cảm nhận chung bằng thang System Usability Scale (SUS).

## 2. Phạm vi
- SUT: EShop Web Admin; luồng **Dashboard → Danh mục → tạo → kiểm tra → xóa danh mục thử nghiệm**.
- Nhóm liên quan: FR-13 (Dashboard), FR-14 (Category Management), IA-01..IA-04.
- Luồng được sử dụng không yêu cầu tính năng *Sửa danh mục* qua GUI vì giao diện hiện tại không hỗ trợ chức năng này. Nếu kịch bản đã thực thi khác, ghi lại kịch bản thật, không sửa lịch sử.
- Phương pháp: moderated, goal-oriented, think-aloud, người điều phối không chỉ cách thao tác.

## 3. Thiết kế mẫu
- **Pilot**: P00 (dùng để kiểm tra kịch bản và công cụ, không tính vào mẫu chính thức).
- **Mẫu chính thức dự kiến**: P01–P07; phải là 7 người thật ngoài lớp HW03.
- Hồ sơ định danh/xác minh lưu riêng. Bảng nộp Moodle hiển thị số liên hệ đã che bốn số giữa. [Hướng dẫn bảo mật](01_huong_dan.md#danh-sách-liên-hệ-và-quyền-riêng-tư).
- Các phiên được ghi nhận vào ngày 10, 13 và 14/11/2026.
- Ghi chú P01–P07 xác nhận người tham gia đồng ý ghi hình/ghi âm. [Chỉ mục phiên](06_danh_sach_video.md).
- Kịch bản ở mục 2 là kế hoạch tham chiếu. [Báo cáo](05_bao_cao_task2_du_thao.md#1-mục-tiêu-và-phạm-vi) mô tả thao tác ghi nhận trong các phiên và kịch bản rút gọn của P06.

## 4. Thước đo
- Task completion: hoàn thành / một phần / không hoàn thành / không xác định; ghi tiêu chí đánh giá.
- Số thao tác nhầm, thời điểm chần chừ, trợ giúp từ moderator (nếu có).
- Phát biểu nguyên văn, câu hỏi phỏng vấn: clarity, error recovery, speed, trust.
- SUS (10 phát biểu, 1–5), trả lời **sau phiên**, tính điểm 0–100.

## 5. Quy trình chuẩn
1. Giải thích mục đích và xin phép ghi hình/ghi âm.
2. Cho người tham gia đăng nhập tài khoản demo, không dùng tài khoản riêng.
3. Đọc nhiệm vụ theo mục tiêu, không hướng dẫn từng thao tác.
4. Quan sát, ghi thời điểm, chỉ gợi mở bằng câu hỏi trung lập.
5. Kết thúc nhiệm vụ, cho trả lời SUS, hỏi thêm bốn nhóm câu hỏi.
6. Lưu và hạn chế quyền truy cập bằng chứng, điền ghi chú phiên.

## 6. Pilot và hiệu chỉnh
- P00 có phản hồi SUS trong dữ liệu nguồn.
- Pilot P00 được ghi nhận lúc 19:00 ngày 10/11/2026 để kiểm tra liên kết và đăng nhập. Người điều phối ghi nhận khó khăn khi đặt lại dữ liệu và đã chỉnh kịch bản sau lượt thử. [Ghi chú P00](sessions/P00_pilot.md).

## 7. Tính hợp lệ và đạo đức
Mẫu nhỏ, thuận tiện, không đại diện cho toàn bộ người dùng quản trị. Không giúp người tham gia bằng chỉ dẫn dẫn dắt; không suy diễn nội dung ngoài video; chỉ báo cáo dữ liệu được quan sát thực tế. Không công bố mật khẩu, thông tin liên hệ, bản ghi chưa được phép.

## 8. Đầu ra
Ghi chú 7 phiên, bằng chứng/video, 7 bộ SUS, bảng phát hiện theo mức độ, bug report với ảnh và GitHub Issues, báo cáo Task 2, AI Audit, AI Critique toàn bài và Git commit log.
