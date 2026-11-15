# AI Audit Report – Task 2: Usability Testing

## Danh sách AI Prompts

**Prompt 01 – Xây dựng kịch bản kiểm thử Usability**

> Dựa trên yêu cầu HW03 Task 2 và hệ thống EShop, hãy xây dựng kịch bản kiểm thử usability cho luồng Admin Dashboard → Category Management. Xác định mục tiêu kiểm thử, nhiệm vụ người tham gia, hướng dẫn điều phối và các tiêu chí quan sát. Đảm bảo kịch bản phù hợp với chức năng thực tế của SUT.

**Prompt 02 – Xây dựng biểu mẫu khảo sát SUS**

> Tạo biểu mẫu System Usability Scale (SUS) gồm 10 câu hỏi tiêu chuẩn, sử dụng thang Likert 1–5, phù hợp để khảo sát 7 người tham gia kiểm thử EShop Admin. Trình bày rõ hướng dẫn trả lời và cách tính điểm SUS.

**Prompt 03 – Phân tích kết quả khảo sát SUS**

> Đọc file Excel chứa kết quả khảo sát SUS của EShop Admin. Kiểm tra công thức tính điểm cho từng người tham gia, tính các chỉ số thống kê tổng hợp và phân tích sự phân bố điểm. Phân biệt dữ liệu pilot và dữ liệu chính thức. Không tự tạo hoặc điều chỉnh câu trả lời khảo sát.

**Prompt 04 – Tạo hồ sơ và biểu mẫu quan sát Task 2**

> Dựa trên yêu cầu HW03 Task 2 và kết quả khảo sát SUS, hãy chuẩn bị các file tài liệu cần thiết cho báo cáo usability testing. Tạo biểu mẫu phân tích riêng cho từng người tham gia P01–P07, dự thảo báo cáo tổng hợp, bảng theo dõi vấn đề usability và checklist hoàn thiện bài nộp. Những nội dung chưa có bằng chứng thực nghiệm phải để placeholder để tôi bổ sung sau.

**Prompt 05 – Đơn giản hóa mẫu ghi chú quan sát**

> Kiểm tra xem việc ghi chú chi tiết theo từng mốc thời gian trong video có thực sự bắt buộc theo yêu cầu Task 2 hay không. Đề xuất một mẫu ghi chú ngắn gọn, dễ điền nhưng vẫn đảm bảo ghi nhận kết quả nhiệm vụ, khó khăn, thao tác sai, phản hồi người tham gia và bằng chứng kiểm thử.

**Prompt 06 – Chuẩn hóa biểu mẫu phân tích cho 7 người tham gia**

> Sử dụng cấu trúc phân tích của P01 làm mẫu tham chiếu và chuẩn hóa các file P02–P07 theo cùng định dạng để thuận tiện cho việc ghi nhận kết quả. Giữ nguyên dữ liệu SUS tương ứng với từng người tham gia, bổ sung mục liên kết đến thư mục Google Drive chứa video kiểm thử và để trống các nhận xét chưa được quan sát thực tế.

**Prompt 07 – Hỗ trợ hoàn thiện báo cáo Usability Testing**

> Dựa trên dữ liệu SUS và các biểu mẫu quan sát đã hoàn thành, hỗ trợ tổ chức nội dung báo cáo Task 2 theo yêu cầu HW03. Phân biệt kết quả định lượng từ SUS và kết quả định tính từ quan sát người tham gia. Không suy diễn hành vi, nguyên nhân lỗi hoặc mức độ nghiêm trọng khi chưa có bằng chứng thực nghiệm.

## Prompt triển khai và xử lý sự cố kiểm thử từ xa

**Công cụ AI** OpenAI Codex (ứng dụng desktop), dùng để rà mã EShop, hỗ trợ cấu hình Vite, backend và Cloudflare Tunnel, kiểm tra môi trường và viết hướng dẫn. Phần này trích các yêu cầu thực tế của sinh viên trong chat Codex. Các lượt gửi ảnh hoặc log được tóm tắt. Email cá nhân, mật khẩu tạm và link riêng của từng phiên được lược bỏ.

### Prompt 08 · Thiết lập môi trường cho 7 người tham gia

**Prompt nguyên văn**

~~~~text
Tôi cần thực hiện HW03 Task 2 — Moderated Usability Evaluation từ xa với 7 người tham gia thật.

Hãy kiểm tra workspace EShop hiện tại và thiết lập một môi trường Web Admin có thể truy cập qua Internet bằng Cloudflare Quick Tunnel.

Yêu cầu:

1. Người tham gia chỉ cần mở một link HTTPS, không cần clone repository hay cài Node.js.
2. Frontend Admin và Backend phải hoạt động thông qua cùng một origin, sử dụng Vite proxy cho `/api`.
3. Giữ nguyên toàn bộ logic nghiệp vụ và giao diện SUT. Chỉ thay đổi cấu hình cần thiết cho môi trường kiểm thử từ xa.
4. Dùng cấu hình môi trường riêng, không làm hỏng chế độ localhost hiện tại.
5. Sử dụng Cloudflare Tunnel có giới hạn truy cập theo email người tham gia. Không công khai backend hoặc cơ sở dữ liệu thử nghiệm không được bảo vệ.
6. Sử dụng cơ sở dữ liệu thử nghiệm cách ly, không xóa dữ liệu đang sử dụng trong Task 1.
7. Không hardcode thông tin đăng nhập vào Git và không đẩy file cấu hình chứa bí mật.
8. Kiểm tra đầy đủ login, Dashboard, Category Management, thao tác thêm/xem/xóa và việc lưu dữ liệu.
9. Kiểm tra xem link hoạt động từ một trình duyệt bên ngoài localhost.
10. Viết tài liệu hướng dẫn tiếng Việt tại `HW03/task2/remote_setup.md`, gồm lệnh khởi chạy, cách cấp quyền người tham gia, kiểm tra lỗi và tắt tunnel sau phiên.
11. Ghi rõ mọi thay đổi cấu hình để phục vụ báo cáo môi trường kiểm thử.
12. Không tạo dữ liệu người tham gia, video hoặc kết quả usability giả.

Hãy triển khai và kiểm tra thực tế những gì môi trường cho phép. Nếu thiếu quyền hoặc công cụ thì báo rõ bước nào tôi cần thực hiện.

Không tự ý push lên GitHub.
~~~~

**Đầu ra và kiểm tra thực tế** Codex tạo trình chạy riêng cho Task 2, tài liệu hướng dẫn tiếng Việt và cấu hình `/api` qua Vite. Lượt kiểm tra kỹ thuật cục bộ ngày 09/11/2026 đã đăng nhập, mở Dashboard, thêm và xem danh mục sau khi tải lại, rồi xóa và xác nhận dữ liệu vắng mặt sau lần tải lại tiếp theo. SQLite thử nghiệm được đối chiếu riêng. Mã băm của database Task 1 trùng trước và sau lượt kiểm. [Trình chạy](../start_remote.mjs) · [Cấu hình và kết quả kiểm tra](../remote_setup.md#3-kiểm-tra-trước-phiên).

### Prompt 09 · Chạy lệnh đúng cửa sổ PowerShell

**Trích lời sinh viên**

> cho xin lệnh path powershell thai thư mục eshop

Ở lượt sau, sinh viên gửi log cho thấy đã nhập lệnh `node HW03/task2/start_remote.mjs` ngay tại lời nhắc của `Read-Host` rồi hỏi “ủa rồi sao nữa”.

**Đầu ra** Hướng dẫn vào thư mục EShop, chạy `Read-Host`, nhập danh sách email tại lời nhắc, trở lại dòng `PS D:\eshop-sut>` rồi mới chạy lệnh Node. [Lệnh PowerShell và cách cấp quyền](../remote_setup.md#2-khởi-chạy-và-cấp-quyền).

### Prompt 10 · Xác định đường dẫn và thông tin dùng cho phiên từ xa

**Trích lời sinh viên**

> Local test URL: http://127.0.0.1:5517
>
> tui gửi cái nào giờ

> `Protected HTTPS URL`   này coi ở đâu á

> tui mở bằng laptop dc ko

Sinh viên cũng hỏi mật khẩu nào cần nhập ở màn hình Admin Login sau bước xác thực email.

**Đầu ra** Hướng dẫn đọc `Protected HTTPS URL` trong log sau khi tunnel kiểm tra xong, kiểm thử bằng trình duyệt trên laptop và dùng mật khẩu EShop tạm của phiên đang chạy sau bước PIN Cloudflare. `Local test URL` phục vụ kiểm tra trên máy điều phối. [Đường dẫn, PIN và tài khoản thử nghiệm](../remote_setup.md#2-khởi-chạy-và-cấp-quyền).

### Prompt 11 · Chẩn đoán lỗi đăng nhập 401 qua tunnel

**Trích lời sinh viên**

> ei tính ra ko dc lun á hoặc là do nó hết hạn quá nhanh hả hay sao

> tôi bị lôiix 401 á

Sinh viên gửi ảnh hộp thoại “Đăng nhập thất bại” và xác nhận `POST /api/login` trả `401` trong thẻ Network.

**Đầu ra và giới hạn** Codex đối chiếu với lần đăng nhập qua Vite cục bộ trả `200`, kiểm tra trạng thái tài khoản và ghi lại cả lỗi DNS Windows lẫn lỗi xác thực qua HTTPS. Quick Tunnel đã mở được cổng xác thực email, nhưng lượt thử này chưa xác nhận được luồng đăng nhập HTTPS đủ ổn định để thực hiện trọn phiên Task 2. Nguyên nhân cụ thể của lỗi `401` vẫn chưa được xác nhận. [Kết quả kiểm tra HTTPS](../remote_setup.md#kết-quả-kiểm-tra-trên-máy-điều-phối).

### Prompt 12 · Tìm phương án dùng tên miền miễn phí và đổi máy chủ DNS

**Trích lời sinh viên**

> Bạn có sẵn **tên miền đang quản lý trên Cloudflare** là gì hình như không á có cách nào lấy free không

> Có GitHub Student Developer Pack rồi

> ko dc rồi cách khác đi

> chọn nào á tui ko thấy

> nó noi request fial 403

**Diễn biến** Sinh viên thử ưu đãi tên miền `.me`, gặp giới hạn đủ điều kiện, rồi chuyển sang đăng ký tên miền miễn phí qua DigitalPlat. Các ảnh tiếp theo ghi lại bước thêm tên miền vào Cloudflare, chọn **Use other nameservers** ở DigitalPlat, báo lỗi `403` và kiểm tra lại trạng thái sau khi đổi nameserver. Trạng thái cuối do sinh viên báo trong chuỗi này là Cloudflare đang kiểm tra nameserver. Chuỗi yêu cầu này chưa có bằng chứng tên miền đã kích hoạt hoặc đã phục vụ EShop qua một tunnel có tên.

### Prompt 13 · Biên tập bảy ghi chú và cập nhật báo cáo Task 2

Sinh viên yêu cầu đọc bảy phân tích đã điền, chuẩn hóa định dạng và chỉnh câu chữ chuyên nghiệp nhưng giữ nguyên ý câu trả lời, rồi đối chiếu và viết lại báo cáo 05. Sinh viên cũng yêu cầu làm rõ cách dùng bảng liên hệ riêng và bản đưa vào ZIP nộp Moodle.

**Đầu ra** Codex biên tập P01–P07 từ ghi chú sinh viên cung cấp, đối chiếu tổng số hoàn thành và số liệu SUS, phân loại các vấn đề usability theo ảnh hưởng quan sát, và ghi rõ các hiện tượng kỹ thuật còn cần tái hiện. Đã đối chiếu yêu cầu che bốn số giữa trong PDF đề bài. Bản nộp được tạo từ danh sách có sẵn, giữ bản liên hệ đầy đủ riêng. [Báo cáo](05_bao_cao_task2_du_thao.md) · [Hướng dẫn quyền riêng tư](01_huong_dan.md#danh-sách-liên-hệ-và-quyền-riêng-tư).

### Prompt 14 · Ghi mốc video và cập nhật GitHub Issues

Sinh viên xác nhận năm pilot P00 đã được sửa và cung cấp mốc video P01 ở 04:23, P06 khoảng 05:00. Sinh viên yêu cầu dùng mốc video trong bug report và GitHub Issues.

**Đầu ra** Codex ghi hai mốc do sinh viên cung cấp vào báo cáo. Đã xác minh đúng fork của sinh viên, tạo issue P01 và bổ sung P06 vào issue #44 đang theo dõi hiện tượng tương ứng. [Bug report](bug_report.md) · [Issue P01](https://github.com/nguyenanhtuan2702/eshop-sut/issues/172) · [Bình luận P06](https://github.com/nguyenanhtuan2702/eshop-sut/issues/44#issuecomment-6889836285).

## Phạm vi kết quả

Các prompt 08–12 ghi lại việc chuẩn bị và kiểm tra kỹ thuật trên máy điều phối. Kết quả của người tham gia được truy vết riêng qua dữ liệu khảo sát, biểu mẫu quan sát và danh sách video của Task 2. [Phân tích SUS](04_phan_tich_SUS.md) · [Danh sách video](06_danh_sach_video.md).
