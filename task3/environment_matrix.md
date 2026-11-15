# Môi trường Task 3

| ID | Browser | OS / thiết bị | Chế độ và lượt chính | Minh chứng nhận diện |
|---|---|---|---|---|
| chrome-windows | Google Chrome 157.0.8103.51 | Windows_NT 10.0.26300, Dell 15 DC15250 | headed, [HW03-MWG1XWLK](automation/chrome-windows-HW03-MWG1XWLK.json) | Ảnh cửa sổ (hồ sơ Moodle) |
| firefox-windows | Firefox (Playwright build) 153.0 | Windows_NT 10.0.26300, Dell 15 DC15250 | headless, [HW03-MWG1UM77](automation/firefox-windows-HW03-MWG1UM77.json) | Ảnh cửa sổ (hồ sơ Moodle) |
| safari-apple | Safari 18.3 | macOS 14.6, Sauce Labs desktop VM, EU Central | webdriver, [HW03-MWGFLFKB](automation/safari-apple-HW03-MWGFLFKB.json) · Sauce ba7c0ecc1c22497b826118331715a170 | Ảnh cửa sổ (hồ sơ Moodle) |

- URL Web Admin http://localhost:5174. API fixture http://localhost:3000. Nguồn SUT 8f3059fbec0512cc8f04972afe6ca20411a98471.
- Các lượt chính dùng bản build Vite trong sandbox, Playwright và SQLite mới từ seed. Firefox là bản Playwright trên Windows. Ảnh nhận diện có thể lấy từ một phiên headed riêng của cùng bản trình duyệt.
- Safari dùng Sauce Labs Automated tại EU Central, qua http://localtest.me:8080. [Log xác minh hạ tầng](automation/sauce-smoke-HW03-MWG5L5L2.json) · [Hướng dẫn chạy](human_verification.md).
- Lượt kiểm thủ công dùng Sauce Labs Live tại EU Central, qua https://localtest.me:8443. Phiên chọn Safari 18 và macOS 14. Chưa thu được số hiệu phụ và Sauce Live job ID. [Log và minh chứng Live](automation/safari-apple-HW03-MWGGKOQX-live.json).
