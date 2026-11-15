# HW03 · Task 3

- [Báo cáo kiểm thử](cross_browser_report.md)
- [Ma trận 70 mục](cross_browser_matrix.xlsx)
- [Tóm tắt](test_summary.md) · [Môi trường](environment_matrix.md) · [Kế hoạch](test_plan.md)
- [Các bước kiểm thủ công và phiên Safari](human_verification.md)
- [Nhật ký AI](ai_audit.md) · [Git commit log](git_commit_log.txt)

## Chạy lại hai môi trường Windows

Chuẩn bị Node.js 24, Playwright 1.62.1, Google Chrome cài trên máy, bản Firefox của Playwright và dependencies EShop đã cài. Nếu dùng Playwright từ bộ công cụ riêng, đặt `NODE_PATH` trỏ đến `node_modules` của bộ đó. Đặt `PLAYWRIGHT_BROWSERS_PATH` nếu Firefox được cài ở thư mục riêng.

Mở PowerShell từ thư mục gốc và đặt danh tính thật cho từng phiên trước khi chụp ảnh.

```powershell
$env:HW03_STUDENT_NAME = Read-Host 'Họ tên'
$env:HW03_STUDENT_ID = Read-Host 'Mã sinh viên'
$env:HW03_STUDENT_EMAIL = Read-Host 'Email sinh viên'
$env:HW03_TEST_DEVICE = Read-Host 'Tên máy'
node HW03/task3/automation/run.cjs chrome --headed
node HW03/task3/automation/run.cjs firefox --headed
```

Chạy hai lệnh lần lượt. Runner dừng nếu cổng 3000 hoặc 5174 đang được dùng. Mỗi lượt có ID riêng và ghi kết quả dưới `automation/`, ảnh dưới `evidence/`. Chạy riêng một ca bằng cách thêm ID ở cuối lệnh.

Chụp cửa sổ nhận diện bằng `node HW03/task3/automation/run.cjs chrome --headed --proof --windows-proof` hoặc thay `chrome` bằng `firefox`. Chạy S-05 bằng `node HW03/task3/automation/run.cjs chrome --headed --windows-proof S-05`. Hai thao tác này cần desktop Windows tương tác. Script chụp theo đúng tiến trình và tiêu đề cửa sổ thử. Khi gửi phím zoom, script kiểm cửa sổ thử đã nhận focus.

Các ảnh có thông tin sinh viên dành cho hồ sơ nộp bài. Các đường dẫn GitHub trong ma trận tham chiếu issue Task 1 đã xác nhận.

## Smoke test Safari trên Sauce Labs

Khởi động Sauce Connect 5.5.5 trong PowerShell đã có biến xác thực, rồi đợi thông báo `you may start your tests`.

```powershell
sauce-connect run --region eu-central --tunnel-name hw03-task3 --proxy-localhost allow --debug-address 127.0.0.1:18080
```

Chạy `node HW03/task3/automation/run.cjs sauce-smoke` từ PowerShell thứ hai có `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`, ba biến danh tính ở trên và `NODE_PATH` trỏ tới bộ công cụ Playwright 1.62.1 cùng `selenium-webdriver` 4.39.0.

Safari mở `http://localtest.me:8080`. Runner kiểm `http://127.0.0.1:8080` cục bộ, xác minh `localtest.me` chỉ trỏ loopback và kiểm lại HTML, JavaScript, `/api/categories` qua proxy debug trước khi xin phiên Safari. `HW03_SMOKE_LOCAL_ONLY=1` chỉ chạy hai phép kiểm trên Windows và không dùng trial. Vite chỉ nghe loopback và chuyển `/api` tới backend sandbox trên máy.

Nếu DNS mạng chặn tên thử, phương án cần duyệt là thêm `127.0.0.1 localtest.me` vào Windows hosts trên máy chạy Sauce Connect rồi kiểm lại qua proxy debug. Request `/api/v1/healthz` nhắm `localhost` trong log trước là probe của Sauce Labs. Runner kiểm tunnel Ready qua API Sauce tại EU Central và kiểm đường vào SUT riêng. [Tài liệu Sauce Connect về localhost](https://docs.saucelabs.com/secure-connections/sauce-connect-5/guides/localhost-proxying/).

Runner yêu cầu Safari 18 trên macOS 14 theo mặc định. Có thể đặt `HW03_SAFARI_PLATFORM` và `HW03_SAFARI_VERSION` theo cặp máy được cấp. Mỗi lượt ghi `automation/sauce-smoke-<run-id>.json`. Ảnh và video riêng tư nằm dưới `evidence/sauce-smoke/<run-id>/`.

Đã xác nhận Sauce Labs Automated chạy được Safari 18.3 trên macOS 14.6 với origin thử `http://localtest.me:8080`. Lượt này vượt qua đăng nhập và kiểm tra dữ liệu Dashboard, Danh mục. [Log](automation/sauce-smoke-HW03-MWG5L5L2.json) · Ảnh nhận diện từ video Sauce (hồ sơ Moodle).

## Chạy checklist Safari

Giữ tunnel có `--debug-address 127.0.0.1:18080`. Từ PowerShell thứ hai đã đặt `NODE_PATH`, chạy:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File HW03/task3/automation/start-safari.ps1
```

Runner xác minh tunnel và proxy rồi thực thi qua Safari theo thứ tự Shared, Dashboard, Categories, Coupons. Mỗi ca khôi phục SQLite sandbox, lưu ảnh riêng và ghi JSON trước khi tiếp tục. Chạy lại cùng lệnh để tiếp tục các ID chưa thử. Có thể chỉ định `-Group shared`, `-Group dashboard`, `-Group categories` hoặc `-Group coupons`. Thêm `-RetryBlocked` để kiểm lại ID bị chặn. Trong shell đã đặt biến xác thực, `node HW03/task3/automation/run.cjs safari C-22` chạy riêng một ID. Các lượt `--webdriver-local` dùng để kiểm adapter và được loại khỏi ma trận Safari.

S-05 cần zoom gốc 200% từ giao diện Safari. [Cách chạy và xác minh zoom](human_verification.md).
