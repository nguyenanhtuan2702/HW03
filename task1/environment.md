# Môi trường kiểm thử Task 1

- **SUT.** EShop, fork `nguyenanhtuan2702/eshop-sut`, nhánh `main`, mã nguồn tại `8f3059fbec0512cc8f04972afe6ca20411a98471`. Lượt gốc ngày 09/11 dùng các tệp thực thi khớp commit này. Lượt kiểm lại ngày 13/11 dùng workspace có thêm cấu hình Task 2, chạy theo cổng và dữ liệu cách ly của Task 1. Trước khi làm bài đã có thay đổi ở `backend/database.sqlite` và bản đã đưa vào vùng chờ của `frontend-web/package-lock.json`.
- **Phạm vi.** Dashboard (FR-13), Danh mục (FR-14) và Mã giảm giá (FR-17). Web Admin là React/Vite tại `http://localhost:5174`. Ba màn hình nằm trong cùng một đường dẫn, đổi qua menu trong `frontend-admin/src/App.jsx`. Web mua hàng (5173) và Expo không cần khởi động cho Task 1.
- **Backend.** Express/Node và SQLite tại `http://localhost:3000/api`. Dashboard đọc `GET /api/admin/orders`. Danh mục dùng `GET/POST /api/categories` và `DELETE /api/categories/:id`. Mã giảm giá dùng `GET /api/coupons`, `POST /api/admin/coupons` và `DELETE /api/admin/coupons/:id`. Có API PUT danh mục, còn GUI và FR-14 chỉ mô tả thêm, xem và xóa. Dữ liệu được tải tuần tự khi đăng nhập và sau thao tác CRUD, nên cần chờ phản hồi đọc lại trước khi kết luận.
- **An toàn dữ liệu.** `backend/database.js` chạy `initDatabase()` ngay khi được nạp, thực hiện DROP/CREATE rồi gieo dữ liệu. Không chạy `node database.js`, `node server.js` từ backend gốc hay `run_servers.sh`. Runner sao chép đúng hai tệp JS backend vào thư mục tạm và dùng SQLite mới do bản sao tự gieo. Tài khoản Admin thử lấy từ dữ liệu demo trong bản sao. Runner không sao chép SQLite gốc và từ chối chạy nếu cổng đã có dịch vụ.
- **Công cụ.** Windows build 26300, Node 24.15.0, Chrome 156.0.8078.81, Playwright có sẵn trong bộ công cụ cục bộ. Đã xác nhận Chrome headless mở trang kiểm tra và driver SQLite nạp được. Repo có một script chẩn đoán hồ sơ đơn lẻ và chưa có bộ kiểm thử GUI.
- **Đầu vào.** `HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx` gồm 69 mục chưa chạy và bốn sheet. Các tài liệu đối chiếu là `README.md`, `api_specification.md`, `setup_guide.md` và PDF đề HW03 đã đọc đủ 9 trang. Hướng dẫn setup có mật khẩu demo Admin khác seed hiện tại, vì vậy lấy tài khoản từ seed của SUT đang chạy.
- **Giới hạn.** Lượt gốc chạy Chrome 156.0.8078.81. Lượt kiểm lại dùng Chrome 157.0.8103.51 và Playwright 1.62.1. Kiểm zoom gốc 200% dùng Chromium 156.0.8078.4 với hồ sơ tạm. Lượt 375 px dùng viewport 375×812 CSS px. [Môi trường theo từng lượt và kết quả](automation/recheck-results.json). Kết luận về bố cục và heuristic giới hạn trong điều khiển, dữ liệu và viewport đã thử. Ảnh headless ghi lại vùng hiển thị của trang, còn hộp thoại native được ghi bằng sự kiện trình duyệt. Việc kiểm tra người dùng thật và ba nền tảng nằm ngoài đợt chạy này.

## Chạy lại

Yêu cầu Node.js 24 có `node:sqlite`, Chrome, Playwright, và các gói đã cài trong `backend` và `frontend-admin`. Nếu Playwright nằm trong bộ công cụ riêng, đặt biến môi trường `NODE_PATH` tới thư mục `node_modules` chứa gói. Dừng đúng dịch vụ của lần chạy khác nếu cổng 3000 hoặc 5174 đã được dùng. Runner tự khởi động và dừng dịch vụ của nó.

Từ thư mục gốc, trong PowerShell, lấy mật khẩu **demo** từ seed của bản đang thử mà không in ra màn hình.

```powershell
$env:HW03_ADMIN_PASSWORD = [regex]::Match(
  (Get-Content -Raw -LiteralPath backend/database.js),
  "'admin@eshop\.com', '([^']+)'"
).Groups[1].Value
node HW03/task1/automation/run.cjs
Remove-Item Env:HW03_ADMIN_PASSWORD
```

Lần chạy đầy đủ ghi `automation/results.json` và ảnh `evidence/<ID>.png`. Để chạy lại một mục riêng mà vẫn giữ log và ảnh của lần đầy đủ, thêm ID sau tên script, chẳng hạn `node HW03/task1/automation/run.cjs D-07`. Lần chẩn đoán ghi `automation/results-diagnostic.json` và `evidence/_diagnostic/`. Sao lưu log và ảnh hiện có trước khi chạy đầy đủ để giữ bằng chứng của lượt gốc. Bộ chạy gốc đo phần cắt ở S-06 và để S-05 chờ phép thử zoom riêng. Excel và báo cáo tổng hợp dùng [kết quả kiểm riêng](automation/recheck-results.json) cho S-05, S-06 và P-20.

Dashboard dùng dữ liệu đơn thử tạo qua API trong sandbox. Trình duyệt thực hiện và xác nhận hành vi GUI; API chỉ chuẩn bị hoặc đối chiếu dữ liệu. Gián đoạn mạng được giới hạn trong ngữ cảnh trình duyệt bằng cách chặn kết nối tới endpoint thật. Khi thử tải chậm, runner giữ rồi chuyển tiếp yêu cầu thật. Dữ liệu khởi tạo trong sandbox được phục hồi giữa các mục, môi trường thử được thu dọn khi hoàn tất.
