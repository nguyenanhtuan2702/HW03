# HW03 Task 2 — Hướng dẫn sử dụng bộ hồ sơ

## Hồ sơ hiện có

- Có ghi chú của bảy phiên chính thức P01–P07 và bảy phản hồi SUS đã đối chiếu. P00 là pilot và được loại khỏi thống kê chính thức.
- Điểm SUS trung bình là 48,21/100, trung vị 47,50 và độ lệch chuẩn mẫu 24,74.
- Theo ghi chú phiên, 3 người hoàn thành nhiệm vụ được giao, 3 người hoàn thành một phần và 1 người không hoàn thành. P06 thực hiện kịch bản rút gọn.

| Tệp | Nội dung |
|---|---|
| [02 — Kế hoạch](02_ke_hoach_usability.md) và [03 — Kịch bản](03_kich_ban_nhiem_vu.md) | Mục tiêu, kịch bản tham chiếu, quy trình điều phối và thước đo. |
| [04 — Phân tích SUS](04_phan_tich_SUS.md) và [bảng tính](SUS_PhanTich.xlsx) | Điểm từng người, cách tính và thống kê chung. |
| [05 — Báo cáo Task 2](05_bao_cao_task2_du_thao.md) | Tổng hợp bảy phiên, kết quả định lượng, phản hồi, mức độ vấn đề và hiện tượng kỹ thuật cần tái hiện. |
| [06 — Chỉ mục video](06_danh_sach_video.md) | Thư mục Drive chung, ghi chú và xác nhận đồng ý ghi hình/ghi âm theo phiên. |
| [Bug report Task 2](bug_report.md) | Hai quan sát kỹ thuật, mốc video và issue đối chiếu. |
| 07 — Danh sách liên hệ | Bản riêng đầy đủ và bản đã che số để nộp Moodle. Xem hướng dẫn bên dưới. |
| [08 — AI Audit](08_AI_audit_task2.md) | Yêu cầu và kết quả hỗ trợ của AI. |
| [Ghi chú P01–P07](sessions/) và [pilot P00](sessions/P00_pilot.md) | Quan sát, phỏng vấn và kết quả từng phiên. |

## Danh sách liên hệ và quyền riêng tư

Đề HW03 yêu cầu đính kèm bảng **bảy người tham gia**, gồm họ tên và thông tin liên hệ có thể xác minh, với **bốn chữ số giữa được che**. ZIP bài nộp được gửi qua Moodle. Đề có yêu cầu Git commit log cho các bước kiểm thử. Quy định nộp bài liệt kê bảng người tham gia trong ZIP.

| Tệp | Cách dùng |
|---|---|
| `07_danh_sach_nguoi_tham_gia_RIENG_TU.md` | Bản đầy đủ giữ riêng để người điều phối có thể hỗ trợ giảng viên hoặc TA xác minh khi được yêu cầu. |
| `07_danh_sach_nguoi_tham_gia_NOP_MOODLE.md` | Bản có mã phiên, họ tên và số đã che bốn chữ số giữa dạng `090****123`. Đưa tệp này vào ZIP nộp Moodle. |

Cả hai tệp được đưa vào `.gitignore`. Các tài liệu dùng Git có thể tham chiếu người tham gia bằng mã P01–P07. Che số là yêu cầu của bảng nộp. Nếu muốn bảo vệ thêm bản đầy đủ, có thể lưu nó trong kho hoặc tệp mã hóa chỉ mình truy cập. Khi chia sẻ video, giữ quyền Drive ở chế độ phù hợp với người chấm.

## Việc còn cần xác minh trước khi nộp

1. Nếu báo cáo cần thời lượng, lấy thời gian bắt đầu và kết thúc từ từng video. Các giá trị như `19h30` trong ghi chú là giờ ghi nhận, chưa đủ để tính thời lượng trung bình.
2. Kiểm tra quyền xem video của người chấm. Mốc **P01 04:23** và **P06 khoảng 05:00** được ghi trong bug report.
3. Đưa bảng đã che số vào ZIP. Kiểm tra tài liệu Markdown/PDF và Git commit log trước khi nộp Moodle.
