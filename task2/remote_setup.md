# HW03 Task 2 · Web Admin cho phiên kiểm thử từ xa

Máy điều phối chạy EShop và Cloudflare Quick Tunnel. Người tham gia mở một link HTTPS trong trình duyệt, xác thực email bằng mã PIN Cloudflare rồi đăng nhập tài khoản Admin thử nghiệm. Cùng URL HTTPS phục vụ giao diện và các yêu cầu `/api`.

## 1. Chuẩn bị trên máy điều phối

- Dùng Node.js 24 trở lên và cài các gói hiện có của `backend` và `frontend-admin` nếu máy chưa có. Chạy `npm ci` trong từng thư mục khi cần.
- Cài bản `cloudflared` hiện hành có hai cờ `--allowed-mail` và `--http-host-header`. Trên Windows, có thể tải bản thực thi chính thức vào `HW03/task2/.tools/cloudflared.exe`, đặt vào PATH hoặc đặt `CLOUDFLARED_PATH` tới tệp đã cài. Kiểm tra phiên bản và mã SHA256 theo trang bản phát hành. [Tải cloudflared](https://developers.cloudflare.com/tunnel/downloads/).
- Chuẩn bị email đúng của những người đã đồng ý tham gia. Dùng email bạn kiểm soát để kiểm tra trước phiên. Email đưa vào danh sách bằng cửa sổ PowerShell, không đưa vào file dự án.

```powershell
node --version
& .\HW03\task2\.tools\cloudflared.exe --version
& .\HW03\task2\.tools\cloudflared.exe tunnel --help |
  Select-String 'allowed-mail|http-host-header'
```

## 2. Khởi chạy và cấp quyền

Từ thư mục gốc EShop, mở PowerShell. Nhập các email cá nhân chính xác, phân cách bằng dấu phẩy. Thêm email điều phối nếu bạn cũng cần vào từ Internet.

```powershell
$env:HW03_TUNNEL_EMAILS = Read-Host 'Nhập các email được phép, phân cách bằng dấu phẩy'
node HW03/task2/start_remote.mjs
```

1. Sau dòng `Local test URL`, công cụ yêu cầu Cloudflare cấp hostname rồi kiểm tra trang chính và `/api/categories`. Giai đoạn này có thể mất khoảng hai phút. Chỉ dùng link xuất hiện sau dòng `Protected HTTPS URL`. Danh sách rỗng hoặc email chứa ký tự đại diện khiến chương trình từ chối khởi chạy.
2. Mở link bằng cửa sổ ẩn danh. Mở cả URL `/api/categories` trong phiên chưa xác thực và xác nhận trang yêu cầu đăng nhập hoặc chặn, thay vì hiện JSON. Dùng một trình duyệt qua mạng khác, chẳng hạn điện thoại tắt Wi-Fi, để kiểm tra HTTPS trước phiên.
3. Dùng email điều phối trong danh sách để nhận mã PIN, nhập mã trực tiếp trên trang Cloudflare. Khi Web Admin mở, đăng nhập bằng tài khoản demo và mật khẩu tạm được in trong cửa sổ khởi chạy. Dùng một email thứ hai bạn kiểm soát và chưa cấp quyền nếu cần kiểm tra bị từ chối. [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).
4. Sau khi xác nhận luồng chạy, gửi riêng URL và thông tin đăng nhập EShop tạm cho người đã được cấp quyền. Mỗi người dùng email của chính họ để nhận PIN. Để đổi danh sách, dừng tiến trình rồi chạy lại với danh sách mới. Lần chạy mới có URL, mật khẩu EShop mặc định và khóa phiên mới.

Chạy chỉ trên máy điều phối, không tạo URL Cloudflare:

```powershell
node HW03/task2/start_remote.mjs --local-only
```

Mở `http://127.0.0.1:5517` và dùng tài khoản được in trong PowerShell. Có thể đặt `HW03_ADMIN_PASSWORD` từ biến môi trường phiên hiện tại để dùng một mật khẩu thử nghiệm riêng từ 16 ký tự trở lên. Nếu biến này trống, chương trình sinh mật khẩu ngẫu nhiên.

## 3. Kiểm tra trước phiên

| Mục | Cách kiểm |
|---|---|
| Quyền ở Cloudflare | Tab ẩn danh chưa xác thực gặp cổng email. Tab đã xác thực bằng email được phép mở được Web Admin. Trang và `/api` đều dùng cùng link HTTPS. |
| Đăng nhập EShop | Nhập tài khoản và mật khẩu thử của lần chạy hiện tại, kiểm tra Dashboard xuất hiện. |
| Dashboard | Kiểm tra màn hình mở được và hai thẻ thống kê hiển thị sau khi API tải xong. |
| Danh mục | Mở **Danh mục**, đọc danh sách, tạo một tên duy nhất như `HW03-T2-KIEM-TRA` và xác nhận có đúng dòng mới. |
| Lưu và xóa | Tải lại toàn bộ trang, mở lại **Danh mục** để kiểm tra dòng còn tồn tại. Xóa đúng dòng vừa tạo, tải lại và xác nhận dòng vẫn vắng mặt. |

Thực hiện lượt kiểm tra kỹ thuật trước buổi với người thật. Lượt này phục vụ xác nhận môi trường, còn quan sát usability được thu từ các phiên có người tham gia.

### Kết quả kiểm tra trên máy điều phối

Ngày 09/11/2026, Chrome 156.0.8078.81 đã đăng nhập và mở Dashboard, đọc danh sách Danh mục, tạo một dòng thử, thấy dòng còn sau khi tải lại, xóa đúng dòng rồi tải lại để xác nhận dòng vẫn vắng mặt. Đối chiếu SQLite riêng xác nhận cả thao tác ghi và xóa. Cả 28 yêu cầu API trình duyệt ghi nhận đều qua origin Vite cục bộ. Vite từ chối Host ngoài danh sách. Tệp SQLite của Task 1 có cùng mã băm trước và sau lượt thử. Bản build mặc định vẫn gọi API localhost cổng 3000 và cấu hình dev Admin vẫn dùng cổng 5174.

**HTTPS và email** Lượt thử ban đầu với cloudflared 2026.10.7 nhận hostname nhưng DNS Windows trả `ENOTFOUND`. Phép đối chiếu sau đó cho thấy DNS công cộng đã có địa chỉ trong khi Windows vẫn chưa phân giải được. Khi gặp lỗi này, trình chạy thử tra hostname qua Cloudflare DNS để xác minh HTTPS. Phép kiểm vẫn xác thực chứng chỉ của hostname. Sau khi cập nhật, Chrome đã mở link thử từ origin HTTPS và cả trang chính lẫn `/api/categories` đều chuyển đến màn hình nhập email của Cloudflare. Luồng nhập PIN của người được cấp quyền vẫn cần kiểm chứng trước khi gửi link cho người tham gia. [Cloudflare DNS và bộ nhớ đệm NXDOMAIN](https://developers.cloudflare.com/dns/troubleshooting/dns-issues/).

**Thử đăng nhập qua HTTPS** Điều phối viên xác thực PIN, thấy màn hình Admin Login nhưng yêu cầu `POST /api/login` trả `401`. Cùng lượt chạy, yêu cầu qua Vite cục bộ trả `200` và cấp token Admin. Tài khoản không bị khóa. Yêu cầu thử qua Quick Tunnel với phiên Cloudflare chưa xác thực cũng trả `401`. Dấu hiệu phù hợp với lỗi phiên email mất hiệu lực ngay sau PIN đã được báo cáo cho Quick Tunnel. Lượt thử chưa xác nhận được một phiên HTTPS đủ ổn định để làm trọn luồng Task 2. [Cloudflare cloudflared #1752](https://github.com/cloudflare/cloudflared/issues/1752).

## 4. Cấu hình và cách ly dữ liệu

- **Admin** dùng chế độ Vite `hw03-remote` để gọi `/api` tương đối. Vite build rồi phục vụ bản build trên `127.0.0.1:5517`. Proxy chỉ nhận nhánh `/api` và chuyển tới backend `127.0.0.1:5300`. Hai tiến trình chỉ lắng nghe trên máy điều phối. Tunnel chỉ trỏ tới Vite. Cờ `--http-host-header` gửi Host nội bộ để giữ kiểm tra Host mặc định của Vite. [Vite Preview](https://vite.dev/config/preview-options.html), [Cloudflare Origin Parameters](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/origin-parameters/#httphostheader).
- **Backend** nhận đường dẫn SQLite riêng qua `HW03_REMOTE_DB` và khóa JWT sinh ngẫu nhiên qua `HW03_REMOTE_JWT`. Lần đầu chương trình gieo dữ liệu từ bản sao script seed vào thư mục tạm rồi chuyển DB đã chuẩn bị vào `HW03/task2/.remote-state/database.sqlite`. Các lần sau dùng lại DB này, đổi mật khẩu demo và giữ dữ liệu Danh mục, Đơn hàng, Mã giảm giá. Kho dữ liệu Task 1 và cấu hình localhost mặc định (Admin 5174, API 3000) vẫn dùng đường dẫn và cổng cũ.
- **Bảo mật thông tin thử** dùng dữ liệu demo và mật khẩu riêng từng lần chạy. SQLite giữ cơ chế lưu tài khoản của SUT; chỉ sử dụng thông tin đăng nhập giả lập do trình chạy cấp. Không nhập email của người tham gia vào EShop. `.remote-state` và `.tools` nằm trong quy tắc bỏ qua của Git. Email danh sách và bí mật không cần tệp cấu hình.
- **Thay đổi mã** giới hạn ở cách chọn API URL trong `frontend-admin/src/App.jsx`, Vite preview trong `frontend-admin/vite.config.js`, cách chọn cổng/địa chỉ/khóa phiên trong `backend/server.js` và lựa chọn đường dẫn SQLite trong `backend/database.js`. Các màn hình và xử lý nghiệp vụ dùng mã SUT hiện tại.

## 5. Xử lý sự cố và kết thúc phiên

| Hiện tượng | Cách xử lý |
|---|---|
| Báo thiếu `--allowed-mail` hoặc `--http-host-header` | Cập nhật bản cloudflared chính thức, kiểm tra `CLOUDFLARED_PATH` và lệnh trợ giúp. |
| Cloudflare không tạo được link hoặc trả lỗi 1033 | Kiểm tra Internet, phiên bản và cấu hình Cloudflare đang có trên máy. Kiểm tra mạng cho phép kết nối đi ra cổng 7844 tới Cloudflare, hoặc thử từ mạng điều phối khác. [Yêu cầu kết nối Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/). |
| Báo `ENOTFOUND` ở cả trang chính và API | Mở PowerShell trên máy điều phối, thử một mạng khác nếu DNS vẫn không phân giải hostname, rồi chạy lại với email của bạn. Chỉ chuyển sang bước PIN khi hiện `Protected HTTPS URL`. |
| Báo cổng 5300/5517 bận | Xem tiến trình đang dùng cổng. Dừng đúng phiên Task 2 trước đó hoặc đổi máy điều phối. |
| Báo `running.lock` đã tồn tại | Kiểm tra chắc chắn tiến trình Task 2 đã tắt và hai cổng không còn lắng nghe. Khi đã xác nhận, xóa riêng `HW03/task2/.remote-state/running.lock` rồi thử lại. |
| Không nhận được mã PIN | Đối chiếu đúng email đã cấp quyền, kiểm tra thư rác và link của lần chạy hiện tại. Nếu sửa danh sách, khởi động lại và dùng URL mới. |
| Trang mở nhưng API lỗi | Thử chế độ `--local-only`. Kiểm tra `http://127.0.0.1:5517/api/categories` trên máy điều phối. Trong tab Network, xác nhận trình duyệt gọi `/api` qua cùng HTTPS. |
| Đăng nhập EShop bị từ chối | Kiểm tra mật khẩu tạm của tiến trình hiện tại, trạng thái khóa tài khoản và việc nhập đúng thông tin Admin thử nghiệm. |

Sau phiên, gõ **q** rồi nhấn **Enter** tại PowerShell đang chạy EShop. Công cụ dừng tunnel, Vite và backend, đồng thời giữ lại SQLite riêng để đối chiếu. Xác nhận link cũ không còn kết nối đến ứng dụng và xóa các biến phiên khỏi PowerShell.

```powershell
Remove-Item Env:HW03_TUNNEL_EMAILS, Env:HW03_ADMIN_PASSWORD -ErrorAction SilentlyContinue
```
