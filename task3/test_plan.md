# Kế hoạch kiểm thử đa trình duyệt · Task 3

## Mục tiêu và phạm vi

Chạy lại 70 mục của [Excel Task 1 cuối](../task1/HW03_Task1_Admin_GUI_Checklist.xlsx) trên Chrome/Windows, Firefox/Windows và Safari trên môi trường Apple có thể kiểm chứng. Phạm vi gồm Dashboard (FR-13), Danh mục (FR-14), Mã giảm giá (FR-17) và bốn nhóm IA-01 đến IA-04. C-22 kiểm focus sau khi xóa bằng bàn phím. A-01 đến A-08 được theo dõi riêng trong Task 1.

| ID nền tảng | Mục tiêu | Cách chạy |
|---|---|---|
| chrome-windows | Google Chrome trên Windows | Playwright với Chrome cài trên máy |
| firefox-windows | Firefox trên Windows | Playwright với bản Firefox dành cho automation, tên bản được ghi trong log |
| safari-apple | Safari 18.3 trên macOS 14.6 | Selenium WebDriver qua Sauce Labs EU Central, tunnel hw03-task3. S-05 dùng Safari Live để thao tác zoom gốc. |

## Thiết kế và dữ liệu

- SUT từ commit `8f3059fbec0512cc8f04972afe6ca20411a98471`. Runner trích mã sang thư mục tạm, gieo SQLite mới và phục hồi fixture sau mỗi ca. Kiểm tra cổng trước khi khởi động. Cấu hình mạng kiểm thử chỉ áp dụng vào bản sao tạm.
- [Danh mục ca](automation/cases.json) lấy ID, nhóm IA, bước, Expected Result và issue từ Excel cuối. Các ca hiện có gọi lại hàm của Task 1. S-06 thực hiện thêm/xem/xóa ở 375 CSS px và C-22 đo focus sau khi xóa. S-05 cần zoom gốc 200% từ giao diện trình duyệt.
- Doanh thu đối chiếu với đơn `delivered` độc lập. Dữ liệu chuẩn bị/kiểm chứng qua API, còn kết quả được quan sát trên Web Admin. Playwright điều khiển lỗi mạng ở trình duyệt. Safari giữ hoặc ngắt request tương ứng tại Vite proxy của sandbox và kiểm phản hồi giao diện thật.

## Tiêu chí và minh chứng

- Entry: phiên trình duyệt xác định được, cả hai cổng chưa bị chiếm, seed Admin và SQLite tạm hoạt động, đủ họ tên, MSSV và email để chụp ảnh nộp bài.
- Exit: 70 dòng cho mỗi nền tảng, có căn cứ cho từng trạng thái, ảnh sai lệch, ảnh nhận diện nền tảng có thanh địa chỉ, đối chiếu log và issue. Task 3 chỉ hoàn thành khi có ba môi trường hợp lệ.
- Passed yêu cầu kết quả quan sát khớp tiêu chí. Failed yêu cầu tái hiện sai lệch. Blocked dùng cho tiền điều kiện thiếu hoặc gián đoạn kỹ thuật. Not Run dùng khi chưa thử. N/A chỉ dùng nếu tiêu chí thực sự không áp dụng và có lý do.
- Mỗi ảnh chính thức chụp trong phiên thật với tên, MSSV, email, nền tảng và URL. Ảnh viewport bổ sung cho ảnh cấp trình duyệt/phiên cloud. Kết quả Task 1 chỉ dùng để so sánh.

## Rủi ro

- Độ trễ và cache có thể làm các bộ chờ sự kiện mạng hụt tín hiệu. Kiểm lại qua trạng thái UI và ghi rõ lượt chạy chẩn đoán.
- Hộp thoại native có thể nằm ngoài ảnh viewport. Thông điệp được ghi vào log sự kiện.
- Thiếu bước xác nhận làm C-18/P-23 bị chặn. Hai ca này dẫn chiếu C-17/P-22 và được thống kê riêng.
- Safari chỉ được ghi nhận sau khi phiên Safari thực tế mở được SUT. WebKit cục bộ không được dùng làm minh chứng Safari.
