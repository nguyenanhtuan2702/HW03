# Đối chiếu GitHub Issues · Task 3

Các lỗi tái hiện được dẫn về issue Task 1 hiện có trên fork. Đã đối chiếu 16 liên kết từ Excel cuối với danh sách issue trên GitHub ngày 14/11/2026.

- [#160](https://github.com/nguyenanhtuan2702/eshop-sut/issues/160) · S-02
- [#161](https://github.com/nguyenanhtuan2702/eshop-sut/issues/161) · S-03
- [#169](https://github.com/nguyenanhtuan2702/eshop-sut/issues/169) · S-04
- [#163](https://github.com/nguyenanhtuan2702/eshop-sut/issues/163) · S-08
- [#166](https://github.com/nguyenanhtuan2702/eshop-sut/issues/166) · S-11, D-10
- [#162](https://github.com/nguyenanhtuan2702/eshop-sut/issues/162) · D-05
- [#23](https://github.com/nguyenanhtuan2702/eshop-sut/issues/23) · D-07
- [#158](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158) · C-04, C-05, P-05, P-06
- [#75](https://github.com/nguyenanhtuan2702/eshop-sut/issues/75) · C-06, C-07
- [#165](https://github.com/nguyenanhtuan2702/eshop-sut/issues/165) · C-15
- [#168](https://github.com/nguyenanhtuan2702/eshop-sut/issues/168) · C-16
- [#164](https://github.com/nguyenanhtuan2702/eshop-sut/issues/164) · C-17, P-22
- [#167](https://github.com/nguyenanhtuan2702/eshop-sut/issues/167) · C-21, P-26
- [#159](https://github.com/nguyenanhtuan2702/eshop-sut/issues/159) · P-08, P-21
- [#8](https://github.com/nguyenanhtuan2702/eshop-sut/issues/8) · P-11, P-12
- [#9](https://github.com/nguyenanhtuan2702/eshop-sut/issues/9) · P-13

## Chênh lệch cần xác minh

| ID | Chrome / Windows | Firefox / Windows | Safari / macOS |
|---|---|---|---|
| S-06 | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tại 375 × 812 CSS px, thanh bên chiếm phần lớn chiều rộng. Các ô trên form Mã Giảm Giá bị ép rất hẹp và sinh viên không thể hoàn tất tạo mã. Ảnh (hồ sơ Moodle) |
| S-09 | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab không đi theo thứ tự Tên danh mục → Thêm mới → nút Xóa đầu bảng. Ảnh (hồ sơ Moodle) |
| S-10 | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Có trường hoặc nút không có chỉ báo focus khi điều hướng bằng Tab: [{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"SELECT"},{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"}] Ảnh (hồ sơ Moodle) |
| P-16 | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab đã vào trường ngày nhưng ArrowDown không chỉnh được giá trị ngày. Ảnh (hồ sơ Moodle) |
| P-18 | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Trình tự focus thực tế code → type → value → minimum → date → uses → code → type → value → minimum → date; mong đợi code → type → value → minimum → date → uses → submit. Ảnh (hồ sơ Moodle) |
| C-22 | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Không tới nút Xóa của hàng thử bằng Tab. Ảnh (hồ sơ Moodle) |

Chưa đăng issue mới cho chênh lệch cần kiểm lại thao tác native hoặc ảnh hưởng của trình chạy.
