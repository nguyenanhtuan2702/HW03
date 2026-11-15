# Tóm tắt Task 3

| Môi trường | Tổng | Có lượt thử | Passed | Failed | Blocked | Not Run | N/A |
|---|---:|---:|---:|---:|---:|---:|---:|
| Chrome / Windows | 70 | 70 | 43 | 25 | 2 | 0 | 0 |
| Firefox / Windows | 70 | 70 | 43 | 25 | 2 | 0 | 0 |
| Safari / Apple | 70 | 70 | 37 | 31 | 2 | 0 | 0 |

Cột Có lượt thử gồm cả Blocked. Hai môi trường Windows có 25 ID cùng Failed, đại diện 16 issue Task 1. 25 trong các ID này đã tái hiện trên cả ba môi trường. Có 6 chênh lệch Passed/Failed cần xác minh và 2 ID có ít nhất một kết quả Blocked.

| ID | Chrome / Windows | Firefox / Windows | Safari / macOS |
|---|---|---|---|
| S-06 | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tại 375 × 812 CSS px, thanh bên chiếm phần lớn chiều rộng. Các ô trên form Mã Giảm Giá bị ép rất hẹp và sinh viên không thể hoàn tất tạo mã. Ảnh (hồ sơ Moodle) |
| S-09 | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab không đi theo thứ tự Tên danh mục → Thêm mới → nút Xóa đầu bảng. Ảnh (hồ sơ Moodle) |
| S-10 | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Có trường hoặc nút không có chỉ báo focus khi điều hướng bằng Tab: [{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"SELECT"},{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"}] Ảnh (hồ sơ Moodle) |
| P-16 | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab đã vào trường ngày nhưng ArrowDown không chỉnh được giá trị ngày. Ảnh (hồ sơ Moodle) |
| P-18 | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Trình tự focus thực tế code → type → value → minimum → date → uses → code → type → value → minimum → date; mong đợi code → type → value → minimum → date → uses → submit. Ảnh (hồ sơ Moodle) |
| C-22 | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Không tới nút Xóa của hàng thử bằng Tab. Ảnh (hồ sơ Moodle) |

[Ma trận đầy đủ](cross_browser_matrix.xlsx) · [Báo cáo](cross_browser_report.md) · [Môi trường](environment_matrix.md)
