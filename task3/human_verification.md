# Kiểm thử thủ công Task 3

## S-05 · Safari macOS ở zoom gốc 200%

**Passed** theo xác nhận của sinh viên sau khi kiểm thủ công ở 200%. Ảnh Dashboard được lưu từ phiên Live và không hiển thị mức zoom. Sinh viên không chụp thêm ảnh riêng. [Xác nhận](automation/safari-apple-S05-confirmation.json) · Ảnh Dashboard (hồ sơ Moodle).

1. Giữ Sauce Connect tunnel `hw03-task3` ở EU Central với `--debug-address 127.0.0.1:18080`. Trong PowerShell đã đặt `NODE_PATH`, chạy `powershell -NoProfile -ExecutionPolicy Bypass -File HW03/task3/automation/start-safari.ps1 -Live`. Chờ `SERVE_READY`. Runner kiểm HTTPS qua Sauce Connect rồi hiện URL và mật khẩu demo tạm.
2. Trên Sauce Labs mở **Live → Cross Browser → Desktop**. Chọn **Safari 18**, **macOS Sonoma 14**, tunnel **`hw03-task3`**, độ phân giải **1440×900** và URL **`https://localtest.me:8443/`**. Bấm **Start Test**, đăng nhập `admin@eshop.com`. Để dán mật khẩu demo từ Windows, dùng **Copy to Clipboard** bên trái của Sauce, sau đó **Edit → Paste** trong Safari. Ghi job ID và phiên bản môi trường.
3. Trong cửa sổ Mac từ xa, bấm menu **Safari** trên cùng bên trái → **Settings…** → biểu tượng **Websites** → **Page Zoom** ở cột trái. Tại hàng **localtest.me**, mở ô phần trăm và chọn **200%**. Bấm **Take Screenshot** của Sauce để lưu ảnh mức zoom, rồi đóng cửa sổ Settings bằng nút đỏ. Giữ nguyên kích thước cửa sổ. [Hướng dẫn zoom của Apple](https://support.apple.com/guide/safari/zoom-in-on-webpages-ibrw1068/mac).
4. **Dashboard:** đọc tên và số trên hai thẻ. **Danh mục:** cuộn nếu cần, bấm vào ô tên và kiểm nút **Thêm mới**, **Xóa** có thể thao tác. **Mã Giảm Giá:** cuộn qua form và bảng, kiểm các ô nhập, nút **Tạo mã** và **Xóa** có thể thao tác. Ghi màn hình và điều khiển cụ thể nếu bị che hoặc không bấm được. Dùng **Take Screenshot** lưu từng màn, giữ thanh địa chỉ và overlay trong ảnh.
5. Trả **Page Zoom** về **100%** rồi làm S-06 bên dưới trong cùng phiên. Sau khi xong, bấm **End Session**. Nếu bạn tự chạy sandbox từ PowerShell, nhấn Enter ở cửa sổ `SERVE_READY` để dừng.

## S-05 · Firefox Windows

**Passed** theo xác nhận của sinh viên sau khi mở Firefox và kiểm thủ công ở 200%. Sinh viên không chụp ảnh cho lượt này. [Xác nhận](automation/firefox-windows-S05-confirmation.json).

Mở phiên Firefox headed bằng `node HW03/task3/automation/run.cjs firefox --headed --proof` và giữ PowerShell khi Firefox đang mở. Trong menu Firefox, chuyển 100% sang 200% rồi kiểm ba màn. Chụp cửa sổ thật có thanh địa chỉ, overlay và số zoom. Nhấn Enter trong PowerShell để đóng phiên.

## S-06 · Safari macOS ở 375 CSS px

Đã chấm **Failed**. Trong Safari Live ở 375 × 812 CSS px, các ô nhập trên form Mã Giảm Giá bị ép hẹp và sinh viên không hoàn tất được thao tác tạo mã. Các bước bên dưới dùng để tái hiện. Ảnh form (hồ sơ Moodle) · [Log Live](automation/safari-apple-HW03-MWGGKOQX-live.json).

1. Sau khi đặt zoom về **100%**, mở `https://localtest.me:8443/__hw03_live_375` trong cùng Safari. Trên đầu trang cần hiện **375 × 812 CSS px**. Mọi thao tác tiếp theo thực hiện trong khung EShop bên dưới số đo.
2. Mở **Dashboard** và kiểm tra đọc được hai chỉ số sau khi cuộn nếu cần. Trong **Danh mục**, nhập `S06-Live`, bấm **Thêm mới**, kiểm hàng xuất hiện rồi bấm **Xóa** đúng hàng vừa tạo.
3. Mở **Mã Giảm Giá**. Thử cuộn trong khung để tiếp cận form. Nhập mã `S06LIVE`, chọn loại cố định, nhập giá trị `5000`, đơn tối thiểu `10000`, ngày hết hạn `2099-12-31`, số lượt `2`. Bấm **Tạo mã**, tìm hàng `S06LIVE` rồi bấm **Xóa** đúng hàng đó. Nếu một điều khiển vẫn bị cắt hoặc không bấm được sau khi đã cuộn, ghi đúng tên điều khiển và thao tác đã thử.
4. Dùng **Take Screenshot** chụp trang có số đo viewport và kết quả thao tác, hoặc chỗ bị vướng. [Log WebDriver trước lượt thủ công](automation/safari-apple-HW03-MWGFLFKB.json).

## Safari Automated

Các nhóm Shared, Dashboard, Categories và Coupons dùng WebDriver qua Sauce Labs. C-22 dùng chuỗi phím thật và đọc `document.activeElement`. Tác vụ trì hoãn hoặc ngắt request áp dụng ở proxy trước backend sandbox. Hộp thoại native được đọc từ WebDriver và ghi thông điệp trước khi đóng. Rà cấu hình Tab của phiên Safari khi xác minh chênh lệch bàn phím.

Nếu phiên Live đang mở để làm S-05, xác minh thêm các ca phím trong cùng VM sau khi trả zoom về 100%. Ghi hành vi với thiết lập mặc định, rồi bật **Safari → Settings → Advanced → Press Tab to highlight each item on a webpage** và thử lại. Lưu cả hai quan sát để biết chênh lệch đến từ thiết lập hay hành vi SUT. [Phím tắt và cách Tab của Safari](https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac).

| Ca | Quan sát |
|---|---|
| S-09 | Kiểm `Tên → Thêm mới → Xóa dòng đầu`. |
| S-10 | Kiểm chỉ báo focus khi Tab qua form Coupon. |
| P-16 | Tab từ Đơn tối thiểu đến Ngày hết hạn, dùng phím đổi ngày, rồi Tab ra. |
| P-18 | Ghi thứ tự Tab qua đủ sáu trường và nút Tạo mã. |
| C-22 | Tạo hai hàng thử, dùng Tab tới Xóa hàng đầu, nhấn Enter để xóa rồi Tab một lần và ghi điều khiển nhận focus. |

[Hướng dẫn chạy](README.md) · [Log xác minh Safari](automation/sauce-smoke-HW03-MWG5L5L2.json) · [Sauce Labs Live](https://docs.saucelabs.com/web-apps/live-testing/live-cross-browser-testing/)
