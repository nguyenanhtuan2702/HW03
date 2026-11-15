# Báo cáo kiểm thử đa trình duyệt · HW03 Task 3

## 1. Mục tiêu và phạm vi

Kiểm tra mức độ nhất quán của Dashboard, Danh mục và Mã giảm giá trên các trình duyệt khác nhau, bao phủ IA-01 đến IA-04. Phạm vi gồm 70 ID lấy từ Excel cuối của Task 1, bao gồm C-22. A-01 đến A-08 được theo dõi riêng trong Task 1.

## 2. SUT và môi trường

SUT lấy từ commit 8f3059fbec0512cc8f04972afe6ca20411a98471. Phiên bản trình duyệt, OS, thiết bị, chế độ và bằng chứng từng lượt được ghi trong [bảng môi trường](environment_matrix.md).

## 3. Thiết kế và tái sử dụng

ID, tiêu chí chấp nhận và bước thiết kế lấy từ [Excel Task 1](../task1/HW03_Task1_Admin_GUI_Checklist.xlsx). Các phép thử được thực hiện lại qua GUI. Kiểm S-06 bằng thao tác thêm, xem và xóa tại 375 CSS px. C-22 xóa bằng Enter, kiểm điều khiển nhận focus sau Tab. API chuẩn bị fixture và đối chiếu độc lập doanh thu của đơn giao thành công.

## 4. Thực thi

Mỗi lượt trích SUT sang bản sao tạm và khởi tạo SQLite riêng. Runner kiểm dữ liệu hiển thị sau đăng nhập, phục hồi fixture giữa các ca, lưu lỗi mạng và hộp thoại liên quan. Các lượt chẩn đoán được lưu cạnh lượt chính. Bản build được phục vụ bằng Vite preview trên loopback. Backend tạm bỏ cache của phản hồi API để mỗi ca đọc đúng fixture. Chế độ thử và giới hạn theo từng case xem trong log.

## 5. Kết quả và so sánh

| Môi trường | Tổng | Có lượt thử | Passed | Failed | Blocked | Not Run | N/A |
|---|---:|---:|---:|---:|---:|---:|---:|
| Chrome / Windows | 70 | 70 | 43 | 25 | 2 | 0 | 0 |
| Firefox / Windows | 70 | 70 | 43 | 25 | 2 | 0 | 0 |
| Safari / Apple | 70 | 70 | 37 | 31 | 2 | 0 | 0 |

## 6. Khác biệt giữa trình duyệt

| ID | Chrome / Windows | Firefox / Windows | Safari / macOS |
|---|---|---|---|
| S-06 | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tại 375 × 812 CSS px, thanh bên chiếm phần lớn chiều rộng. Các ô trên form Mã Giảm Giá bị ép rất hẹp và sinh viên không thể hoàn tất tạo mã. Ảnh (hồ sơ Moodle) |
| S-09 | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab không đi theo thứ tự Tên danh mục → Thêm mới → nút Xóa đầu bảng. Ảnh (hồ sơ Moodle) |
| S-10 | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Có trường hoặc nút không có chỉ báo focus khi điều hướng bằng Tab: [{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"SELECT"},{"visible":true,"tag":"INPUT"},{"visible":true,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"},{"visible":false,"tag":"INPUT"}] Ảnh (hồ sơ Moodle) |
| P-16 | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Tab vào được trường ngày, bàn phím đổi giá trị thành 2099-12-30, sau đó Tab sang giới hạn lượt dùng. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Tab đã vào trường ngày nhưng ArrowDown không chỉnh được giá trị ngày. Ảnh (hồ sơ Moodle) |
| P-18 | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: code → type → value → minimum → date → uses → submit. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Trình tự focus thực tế code → type → value → minimum → date → uses → code → type → value → minimum → date; mong đợi code → type → value → minimum → date → uses → submit. Ảnh (hồ sơ Moodle) |
| C-22 | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) | Passed. Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp. [Log](automation/firefox-windows-HW03-MWG1UM77.json) | Failed. Không tới nút Xóa của hàng thử bằng Tab. Ảnh (hồ sơ Moodle) |

S-06 đạt khi thao tác qua Playwright trên Chrome/Firefox. Trong Safari Live, ở cùng chiều rộng CSS, sinh viên không hoàn tất được form Mã Giảm Giá bằng thao tác trực tiếp. Mức ảnh hưởng đã được quan sát trong điều kiện này. Phương pháp thao tác và phiên thử khác nhau, nên chưa xác lập nguyên nhân riêng của Safari.

Tại các ca phụ thuộc hành vi control native, thông báo khác ngôn ngữ hoặc cách dùng phím cần được xét theo tiêu chí của ca. Sự khác biệt chỉ được ghi là lỗi tương thích khi tái hiện sai lệch bằng thao tác tương ứng trên các trình duyệt.

Phiên Sauce gửi phím Tab thông qua WebDriver. Cần xác minh thiết lập điều hướng bàn phím của Safari khi đối chiếu ca focus vì thiết lập này có thể thay đổi việc Tab đi tới nút hoặc điều khiển. [Hướng dẫn bàn phím Safari](https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac).

## 7. Lỗi chung đã quan sát

- **S-02** Thêm mới rgb(37, 99, 235); Xóa rgb(239, 68, 68); Tạo mã rgb(249, 115, 22) (cam, sai màu xanh dương của FR-21). Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/160)
- **S-03** Mỗi màn hình có một h1 chung “EShop Admin”. Nội dung từng màn chỉ có ở h2 (Dashboard, Quản lý Danh mục, Quản lý Mã Giảm Giá). Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/161)
- **S-04** Nút Xóa có chữ rgb(255, 255, 255) trên nền rgb(239, 68, 68), tỷ lệ 3.76:1, dưới 4,5:1. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/169)
- **S-08** Tab không focus được bất kỳ mục menu đích nào. Focus thực tế: BODY → BODY → BODY → BODY → BODY → BODY → BODY → BODY. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/163)
- **S-11** GET /api/admin/users thất bại; Dashboard vẫn hiển thị “0 ₫” và “0” mà không có thông báo lỗi. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/166)
- **D-05** Nhãn “Tổng doanh thu (Delivered)” dùng “Delivered” cho trạng thái đã giao, trong khi các nhãn trạng thái dành cho người dùng tiếng Việt. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/162)
- **D-07** Dashboard hiển thị 493.620 ₫; tổng đối chiếu của riêng đơn đã giao là 246810 ₫. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/23)
- **D-10** Khi GET đơn hàng chưa được chuyển đi, giao diện đã hiển thị 0 ₫ và 0 và không có trạng thái đang tải nhận biết được. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/166)
- **C-04** Ô tên chỉ có placeholder “Tên danh mục mới”, không có nhãn hiển thị cố định hoặc label liên kết. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158)
- **C-05** Form thêm danh mục không có nhãn tên kèm dấu *. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158)
- **C-06** Tên "" được lưu. Dòng #6 xuất hiện với ô tên "". Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/75)
- **C-07** Tên "   " được lưu. Dòng #7 xuất hiện với ô tên "   ". Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/75)
- **C-15** Hai lần bấm trong lúc chờ tạo 2 hàng cùng tên sau tải lại. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/165)
- **C-16** GUI chỉ hiện “Lỗi thêm DM: Network Error”, không cho biết cách khôi phục. Form vẫn giữ tên đã nhập. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/168)
- **C-17** Một lần bấm Xóa gửi DELETE và làm mất dòng #16 ngay. Không có hộp thoại xác nhận. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/164)
- **C-21** Danh mục rỗng có 0 dòng và 0 thông báo trạng thái rỗng. GUI chỉ hiện form và đầu bảng. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/167)
- **P-05** Các điều khiển không có nhãn bền vững: Mã coupon (VD: SAVE10), SELECT, Giá trị % (VD: 10), Đơn tối thiểu (₫), Ngày hết hạn, Số lần dùng tối đa/người. Placeholder hoặc lựa chọn hiện tại không thay thế nhãn. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158)
- **P-06** Form không gắn dấu * cạnh nhãn cho các trường bắt buộc FR-17: code, type, value, minimum, date, uses. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158)
- **P-08** Mã HW03-MWG1XWLK-P-08-DUP được giữ một bản ghi, nhưng thông báo giao diện là “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code” thay vì giải thích rõ mã đã tồn tại. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/159)
- **P-11** Form chấp nhận giá trị giảm 0 và POST trả HTTP 200, mã HW03-MWG1XWLK-P-11-GUI xuất hiện trong bảng. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/8)
- **P-12** Form chấp nhận giá trị giảm -10 và POST trả HTTP 200, mã HW03-MWG1XWLK-P-12-GUI xuất hiện trong bảng. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/8)
- **P-13** Form chấp nhận đơn tối thiểu -1 ₫ và POST trả HTTP 200, mã HW03-MWG1XWLK-P-13-GUI xuất hiện trong bảng. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/9)
- **P-21** Tạo mã trùng trả HTTP 500. Sau khi đóng hộp thoại “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code”, form không hiển thị thông báo lỗi phía trên nút Tạo mã. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/159)
- **P-22** Bấm Xóa một lần đã xóa HW03-MWG1XWLK-P-22-CONFIRM và cập nhật bảng, không có hộp thoại xác nhận. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/164)
- **P-26** Sau khi dữ liệu tải xong, bảng coupon có 0 hàng nhưng không có thông báo danh sách rỗng. Ảnh Chrome (hồ sơ Moodle) · Ảnh Firefox (hồ sơ Moodle) · Ảnh Safari (hồ sơ Moodle) · [Issue Task 1](https://github.com/nguyenanhtuan2702/eshop-sut/issues/167)

Các ID có cùng GitHub Issue được tính theo issue để tránh đếm trùng. Phạm vi kết luận hiện chỉ áp dụng cho các môi trường có dữ liệu quan sát.

## 8. Minh chứng và truy vết

[Ma trận](cross_browser_matrix.xlsx) liên kết ảnh và issue theo ID. Tab Thực thi ghi kết quả, bước, thời điểm, lỗi liên quan và tệp JSON gốc. Ảnh viewport được chụp trong trang đang chạy với overlay danh tính. Ảnh cửa sổ có thanh địa chỉ được liệt kê trong [bảng môi trường](environment_matrix.md).

S-05 được ghi Passed theo xác nhận kiểm thủ công của sinh viên trên Firefox / Windows và Safari / Apple. Firefox không có ảnh cho ca này. Safari có ảnh Dashboard, ảnh không hiển thị mức 200%. [Xác nhận Firefox / Windows](automation/firefox-windows-S05-confirmation.json) · [Xác nhận Safari / Apple](automation/safari-apple-S05-confirmation.json).

## 9. Giới hạn

- **C-18** Chrome / Windows · Không có bước xác nhận để chọn Hủy. Xem C-17. [Log](automation/chrome-windows-HW03-MWG1XWLK.json) · Firefox / Windows · Không có bước xác nhận để chọn Hủy. Xem C-17. [Log](automation/firefox-windows-HW03-MWG1UM77.json) · Safari / Apple · Không có bước xác nhận để chọn Hủy. Xem C-17. [Log](automation/safari-apple-HW03-MWG642BV.json)
- **P-23** Chrome / Windows · Không có hộp thoại xác nhận để thực hiện thao tác Hủy (xem P-22). [Log](automation/chrome-windows-HW03-MWG1XWLK.json) · Firefox / Windows · Không có hộp thoại xác nhận để thực hiện thao tác Hủy (xem P-22). [Log](automation/firefox-windows-HW03-MWG1UM77.json) · Safari / Apple · Không có hộp thoại xác nhận để thực hiện thao tác Hủy (xem P-22). [Log](automation/safari-apple-HW03-MWG6ER88.json)
- Firefox dùng bản Playwright, mức tương đồng với Firefox phát hành chính thức còn phụ thuộc tích hợp nền tảng. [Tài liệu Playwright](https://playwright.dev/docs/browsers).
- Tất cả ID Safari đã có lượt thử, gồm các ca Blocked liệt kê ở trên.

## 10. Kết luận

Task 3 ghi kết quả riêng cho từng môi trường. Safari có 37 Passed, 31 Failed, 2 Blocked và 0 Not Run. [Kết quả kiểm thủ công](human_verification.md).
