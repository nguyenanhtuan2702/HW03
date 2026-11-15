# HW03 Task 1 · Bản nháp GitHub Issues

Dựa trên lần chạy GUI `HW03-MW9D83SL` ngày 09/11/2026, lúc 21:37:35–21:38:59 (UTC+7). Nội dung dưới đây lưu các bước tái hiện và minh chứng đã dùng để đăng issue hoặc bổ sung vào issue hiện có. [Log đầy đủ theo checklist ID](automation/results.json) ghi bước thực tế, timestamp, kết quả và sự kiện hộp thoại.

**Môi trường chung.** EShop commit `8f3059fbec0512cc8f04972afe6ca20411a98471`, Web Admin `http://localhost:5174`, API `http://localhost:3000`, Chrome 156.0.8078.81 headless, Playwright 1.62.1, Windows build 26300, locale `vi-VN`, viewport mặc định 1440 × 900 CSS px. Đăng nhập bằng tài khoản Admin demo trên SQLite cách ly do backend gieo dữ liệu. Dùng bản ghi tạo riêng cho các thao tác có thay đổi dữ liệu. [Thiết lập và cách chạy lại](gui_checklist_report.md).

25 mục Failed trong checklist tổng hợp được gộp thành 15 bản nháp, gồm 8 nhóm lỗi SRS và 7 nhóm sai lệch usability. S-06 được giữ riêng làm quan sát bố cục ở 375 px. S-05 đạt khi kiểm zoom gốc 200%. C-18 và P-23 vẫn Blocked vì thiếu bước xác nhận để bấm Hủy. A-01, A-02 và A-05 là phát hiện từ mục đề xuất, nằm ngoài 69 mục chính. [Bằng chứng kiểm lại](automation/recheck-results.json).

## Sai lệch SRS đã tái hiện

### T1-01 · Dashboard tính doanh thu đã giao gấp đôi

**Căn cứ và phạm vi.** FR-13 · Dashboard.
**Mức độ.** Cao — Dashboard báo sai doanh thu quản trị dù dữ liệu đơn đúng.

**Tái hiện**

1. Trên dữ liệu thử độc lập, tạo đơn 246.810 ₫ rồi chuyển `pending → confirmed → shipping → delivered`.
2. Tạo thêm một đơn 135.790 ₫ và giữ `pending`. Đối chiếu tổng giá trị các đơn `delivered` từ danh sách đơn.
3. Tải lại Web Admin và đọc thẻ Tổng doanh thu.

**Kỳ vọng và quan sát**

- **D-07.** **Kỳ vọng.** Doanh thu bằng tổng total_amount của các đơn delivered. **Quan sát.** Dashboard hiển thị 493.620 ₫; tổng đối chiếu của riêng đơn đã giao là 246810 ₫. [Ảnh D-07](evidence/D-07.png).

### T1-02 · Form Danh mục lưu bản ghi không có tên

**Căn cứ và phạm vi.** FR-14 · Danh mục.
**Mức độ.** Cao — Bảng lưu và hiển thị danh mục không thể nhận diện bằng tên.

**Tái hiện**

1. Mở Danh mục trong Web Admin và để ô Tên danh mục mới trống.
2. Bấm Thêm mới rồi xem dòng vừa xuất hiện.
3. Lặp lại với ba dấu cách trong một lượt thử độc lập để kiểm tra biến thể tên không có ký tự nhìn thấy.

**Kỳ vọng và quan sát**

- **C-06.** **Kỳ vọng.** Không tạo hàng tên rỗng; giao diện chỉ rõ tên là bắt buộc. **Quan sát.** Tên "" được lưu. Dòng #5 xuất hiện với ô tên "". [Ảnh C-06](evidence/C-06.png).
- **C-07.** **Kỳ vọng.** Tên không có ký tự nhìn thấy bị từ chối và người dùng biết cần sửa tên. **Quan sát.** Tên "   " được lưu. Dòng #6 xuất hiện với ô tên "   ". [Ảnh C-07](evidence/C-07.png).

### T1-03 · Form Mã giảm giá lưu giá trị giảm không dương và ngưỡng đơn âm

**Căn cứ và phạm vi.** FR-17 · Mã giảm giá.
**Mức độ.** Cao — Bản ghi sai ràng buộc được lưu và hiển thị như mã hợp lệ trong bảng quản trị.

**Tái hiện**

1. Mở Mã Giảm Giá và nhập một mã thử mới, loại Phần trăm, ngày 2099-12-31 và giới hạn 2 lượt.
2. Lặp ba lần với mã riêng cho từng dữ liệu: giá trị 0 và ngưỡng 20.000 ₫, giá trị −10 và ngưỡng 20.000 ₫, giá trị 12 và ngưỡng −1 ₫.
3. Bấm Tạo mã mỗi lần rồi kiểm tra thông báo, phản hồi POST và bảng mã.

**Kỳ vọng và quan sát**

- **P-11.** **Kỳ vọng.** Không tạo coupon giá trị 0; có hướng dẫn phù hợp. **Quan sát.** Form chấp nhận giá trị giảm 0 và POST trả HTTP 200, mã HW03-MW9D83SL-P-11-GUI xuất hiện trong bảng. [Ảnh P-11](evidence/P-11.png).
- **P-12.** **Kỳ vọng.** Không tạo coupon giá trị âm; có hướng dẫn phù hợp. **Quan sát.** Form chấp nhận giá trị giảm -10 và POST trả HTTP 200, mã HW03-MW9D83SL-P-12-GUI xuất hiện trong bảng. [Ảnh P-12](evidence/P-12.png).
- **P-13.** **Kỳ vọng.** Không tạo coupon với đơn tối thiểu dưới 0. **Quan sát.** Form chấp nhận đơn tối thiểu -1 ₫ và POST trả HTTP 200, mã HW03-MW9D83SL-P-13-GUI xuất hiện trong bảng. [Ảnh P-13](evidence/P-13.png).

### T1-04 · Form Danh mục và Mã giảm giá thiếu nhãn có dấu sao cho trường bắt buộc

**Căn cứ và phạm vi.** FR-22, FR-14, FR-17 · Danh mục và Mã giảm giá.
**Mức độ.** Thấp — Thiếu chỉ dẫn trường bắt buộc và nhãn cố định làm tăng khả năng nhập thiếu hoặc mất ngữ cảnh sau khi nhập.

**Tái hiện**

1. Mở Danh mục và quan sát ô Tên danh mục mới trước và sau khi nhập.
2. Mở Mã Giảm Giá. Quan sát nhãn và dấu * của mã, loại, giá trị, đơn tối thiểu, ngày hết hạn và lượt dùng.
3. Kiểm tra nhãn hiển thị và liên kết nhãn trong DOM để phân biệt nhãn cố định với placeholder.

**Kỳ vọng và quan sát**

- **C-05.** **Kỳ vọng.** Có dấu * bên cạnh nhãn trường bắt buộc. **Quan sát.** Form thêm danh mục không có nhãn tên kèm dấu *. [Ảnh C-05](evidence/C-05.png).
- **P-06.** **Kỳ vọng.** Mỗi trường bắt buộc có dấu * cạnh nhãn. **Quan sát.** Form không gắn dấu * cạnh nhãn cho các trường bắt buộc FR-17: code, type, value, minimum, date, uses. [Ảnh P-06](evidence/P-06.png).
- **C-04.** **Kỳ vọng.** Ô có nhãn thấy được và tên truy cập có thể nhận diện sau khi nhập. **Quan sát.** Ô tên chỉ có placeholder “Tên danh mục mới”, không có nhãn hiển thị cố định hoặc label liên kết. [Ảnh C-04](evidence/C-04.png).
- **P-05.** **Kỳ vọng.** Mỗi trường có nhãn nhận diện được sau khi nhập và tên truy cập phù hợp. **Quan sát.** Các điều khiển không có nhãn bền vững: Mã coupon (VD: SAVE10), SELECT, Giá trị % (VD: 10), Đơn tối thiểu (₫), Ngày hết hạn, Số lần dùng tối đa/người. Placeholder hoặc lựa chọn hiện tại không thay thế nhãn. [Ảnh P-05](evidence/P-05.png).

C-04 và P-05 bổ sung bằng chứng về nhãn truy cập. C-05 và P-06 xác định sai lệch FR-22 về dấu *.

### T1-05 · Lỗi mã trùng không xuất hiện phía trên nút Tạo mã

**Căn cứ và phạm vi.** FR-22 · Mã giảm giá, kích hoạt bằng mã duy nhất FR-17.
**Mức độ.** Trung bình — Quản trị viên phải đóng hộp thoại rồi quay lại biểu mẫu, nơi thiếu chỉ dẫn sửa lỗi.

**Tái hiện**

1. Trong sandbox, tạo một mã dùng một lần có giá trị 12%, ngưỡng 20.000 ₫, hạn 2099-12-31 và giới hạn 2 lượt.
2. Nhập lại đúng mã và dữ liệu hợp lệ rồi bấm Tạo mã.
3. Ghi nội dung hộp thoại, đóng hộp thoại và kiểm tra vùng phía trên nút Tạo mã.

**Kỳ vọng và quan sát**

- **P-21.** **Kỳ vọng.** Thông báo lỗi hiển thị trong giao diện phía trên nút Tạo mã. **Quan sát.** Tạo mã trùng trả HTTP 500. Sau khi đóng hộp thoại “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code”, form không hiển thị thông báo lỗi phía trên nút Tạo mã. [Ảnh P-21](evidence/P-21.png).
- **P-08.** **Kỳ vọng.** Mã trùng bị từ chối; phản hồi chỉ rõ mã đã tồn tại. **Quan sát.** Mã HW03-MW9D83SL-P-08-DUP được giữ một bản ghi, nhưng thông báo giao diện là “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code” thay vì giải thích rõ mã đã tồn tại. [Ảnh P-08](evidence/P-08.png).

P-08 ghi một hàng duy nhất và mã trùng bị từ chối. Phần phản hồi khó hiểu của P-08 là quan sát usability cùng sự kiện với sai lệch vị trí FR-22. Ảnh ghi form ngay sau khi đóng hộp thoại native, nội dung hộp thoại nằm trong log sự kiện.

### T1-06 · Nút Tạo mã dùng màu cam

**Căn cứ và phạm vi.** FR-21 · Mã giảm giá, đối chiếu Danh mục.
**Mức độ.** Thấp — Màu hành động tạo không nhất quán giữa hai màn hình và theo quy ước chung.

**Tái hiện**

1. Mở Danh mục, quan sát màu Thêm mới và Xóa.
2. Chuyển sang Mã Giảm Giá và quan sát màu Tạo mã. Dùng màu nền tính toán trong trình duyệt để đối chiếu.

**Kỳ vọng và quan sát**

- **S-02.** **Kỳ vọng.** Nút hành động tích cực màu xanh dương; nút xóa màu đỏ. **Quan sát.** Thêm mới rgb(37, 99, 235); Xóa rgb(239, 68, 68); Tạo mã rgb(249, 115, 22) (cam, sai màu xanh dương của FR-21). [Ảnh S-02](evidence/S-02.png).

## Sai lệch FR-21 đã xác nhận cách áp dụng

### T1-07 · Heading cấp 1 chung không mô tả nội dung màn Admin đang mở

**Căn cứ và phạm vi.** FR-21 · Dashboard, Danh mục và Mã giảm giá.
**Mức độ.** Thấp — Heading chính chỉ nhận diện ứng dụng và không mô tả nội dung view đang mở.

**Tái hiện**

1. Mở lần lượt Dashboard, Danh mục và Mã Giảm Giá.
2. Quan sát heading hiển thị và kiểm tra thẻ h1, h2 trong DOM của mỗi view.

**Kỳ vọng và quan sát**

- **S-03.** **Kỳ vọng.** Mỗi trang có đúng một h1 mô tả nội dung trang. **Quan sát.** Mỗi màn hình có một h1 chung “EShop Admin”. Nội dung từng màn chỉ có ở h2 (Dashboard, Quản lý Danh mục, Quản lý Mã Giảm Giá). [Ảnh S-03](evidence/S-03.png).

Áp dụng tiêu chí cho nội dung từng màn Admin. Cả ba màn có một h1 cấp ứng dụng, còn tiêu đề mô tả màn nằm ở h2. Giữ S-03 Failed.

### T1-08 · Thẻ doanh thu dùng trạng thái tiếng Anh Delivered

**Căn cứ và phạm vi.** FR-21 · Dashboard.
**Mức độ.** Thấp — Một trạng thái nghiệp vụ tiếng Anh nằm trong nhãn dành cho người quản trị Việt Nam.

**Tái hiện**

1. Mở Dashboard bằng phiên Admin.
2. Đọc đầy đủ nhãn thẻ Tổng doanh thu và đối chiếu quy ước ngôn ngữ của FR-21.

**Kỳ vọng và quan sát**

- **D-05.** **Kỳ vọng.** Hậu tố nếu có diễn đạt trạng thái giao thành công dễ hiểu, ưu tiên nhãn “Đã giao”. **Quan sát.** Nhãn “Tổng doanh thu (Delivered)” dùng “Delivered” cho trạng thái đã giao, trong khi các nhãn trạng thái dành cho người dùng tiếng Việt. [Ảnh D-05](evidence/D-05.png).

“Delivered” là nhãn trạng thái nghiệp vụ, dùng bản dịch “Đã giao”. Giữ D-05 Failed.

## Vấn đề usability tái hiện theo heuristic

### U1-01 · Menu Admin không nhận focus từ bàn phím

**Căn cứ và phạm vi.** Điều hướng bằng bàn phím · Cả ba màn.
**Mức độ.** Trung bình — Người dùng chỉ dùng bàn phím không thể vào các phân hệ từ menu.

**Tái hiện**

1. Đăng nhập, giữ Dashboard đang mở và bắt đầu từ đầu trang.
2. Dùng Tab lần lượt để tìm Dashboard, Danh mục và Mã Giảm Giá. Nếu focus tới được, dùng Enter hoặc Space để kích hoạt.

**Kỳ vọng và quan sát**

- **S-08.** **Kỳ vọng.** Có thể tới và mở cả ba màn bằng bàn phím. **Quan sát.** Tab không focus được bất kỳ mục menu đích nào. Focus thực tế: BODY → BODY → BODY → BODY → BODY → BODY → BODY → BODY. [Ảnh S-08](evidence/S-08.png).

### U1-02 · Một lần bấm Xóa làm mất ngay danh mục hoặc mã giảm giá

**Căn cứ và phạm vi.** An toàn thao tác xóa · FR-14 và FR-17 là bối cảnh.
**Mức độ.** Trung bình — Nhấp nhầm có thể làm mất dữ liệu ngay mà không có cơ hội dừng.

**Tái hiện**

1. Tạo một danh mục thử và một mã giảm giá thử trong sandbox.
2. Mở Danh mục, bấm Xóa đúng dòng dùng một lần và quan sát có xác nhận hoặc cơ hội dừng trước khi gửi DELETE.
3. Lặp lại tại Mã Giảm Giá với mã dùng một lần.

**Kỳ vọng và quan sát**

- **C-17.** **Kỳ vọng.** Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn tương đương trước khi xóa. **Quan sát.** Một lần bấm Xóa gửi DELETE và làm mất dòng #15 ngay. Không có hộp thoại xác nhận. [Ảnh C-17](evidence/C-17.png).
- **P-22.** **Kỳ vọng.** Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn trước khi xóa. **Quan sát.** Bấm Xóa một lần đã xóa HW03-MW9D83SL-P-22-CONFIRM và cập nhật bảng, không có hộp thoại xác nhận. [Ảnh P-22](evidence/P-22.png).

C-18 và P-23 là Blocked vì giao diện hiện tại thiếu bước Hủy.

### U1-03 · Bấm Thêm mới lặp khi đang chờ tạo hai danh mục

**Căn cứ và phạm vi.** Chống gửi trùng do thao tác lặp · Danh mục.
**Mức độ.** Trung bình — Một ý định tạo có thể sinh bản ghi dư nếu người dùng bấm lại khi chậm phản hồi.

**Tái hiện**

1. Nhập một tên danh mục thử duy nhất.
2. Giữ yêu cầu POST đầu ở trình duyệt, bấm Thêm mới lần hai khi lượt đầu chưa trả kết quả, rồi cho các yêu cầu thật tiếp tục.
3. Đếm POST thực tế và các dòng cùng tên sau khi bảng cập nhật.

**Kỳ vọng và quan sát**

- **C-15.** **Kỳ vọng.** Một ý định tạo dẫn đến tối đa một bản ghi khi bấm lặp trong lúc đang xử lý. **Quan sát.** Hai lần bấm trong lúc chờ tạo 2 dòng cùng tên. Ghi nhận 2 yêu cầu POST. [Ảnh C-15](evidence/C-15.png).

### U1-04 · Dashboard trình bày số 0 khi tải chậm hoặc mất kết nối

**Căn cứ và phạm vi.** Phản hồi tải và lỗi kết nối · Dashboard.
**Mức độ.** Trung bình — Số 0 nhìn như kết quả hợp lệ có thể khiến người dùng hiểu nhầm dữ liệu đơn và doanh thu.

**Tái hiện**

1. D-10: Tải lại Dashboard, giữ yêu cầu GET danh sách đơn hàng ở trình duyệt và quan sát trước khi cho yêu cầu thật tiếp tục.
2. S-11: Ngắt trình duyệt khỏi API thử, tải lại Dashboard và quan sát giao diện sau khi yêu cầu thất bại.
3. Đối chiếu hai trạng thái với Dashboard đã tải thành công khi dữ liệu thực có 0 đơn.

**Kỳ vọng và quan sát**

- **D-10.** **Kỳ vọng.** Có dấu hiệu đang tải hoặc trạng thái tạm đủ rõ để tránh hiểu nhầm là số 0 đã tải. **Quan sát.** Khi GET đơn hàng chưa được chuyển đi, giao diện đã hiển thị 0 ₫ và 0 và không có trạng thái đang tải nhận biết được. [Ảnh D-10](evidence/D-10.png).
- **S-11.** **Kỳ vọng.** View phân biệt lỗi kết nối với dữ liệu rỗng và thông báo tình trạng hoặc hướng phục hồi. **Quan sát.** GET /api/admin/users thất bại; Dashboard vẫn hiển thị “0 ₫” và “0” mà không có thông báo lỗi. [Ảnh S-11](evidence/S-11.png).

Ảnh thể hiện trạng thái trang tại từng thời điểm. Log ghi yêu cầu thật bị giữ ở trình duyệt hoặc gặp lỗi kết nối.

### U1-05 · Bảng rỗng thiếu thông báo cho Danh mục và Mã giảm giá

**Căn cứ và phạm vi.** Phản hồi trạng thái rỗng · Danh mục và Mã giảm giá.
**Mức độ.** Thấp — Người dùng khó phân biệt dữ liệu rỗng với vấn đề tải, dù nút tạo vẫn truy cập được.

**Tái hiện**

1. Dùng sandbox riêng có bảng Danh mục rỗng, tải lại Admin, chờ dữ liệu thật tải xong rồi mở Danh mục.
2. Lặp lại với bảng mã giảm giá rỗng và mở Mã Giảm Giá.
3. Quan sát phần đầu bảng và vùng dành cho thông báo dữ liệu rỗng.

**Kỳ vọng và quan sát**

- **C-21.** **Kỳ vọng.** Có thông báo không có danh mục, người dùng nhận biết có thể thêm mới. **Quan sát.** Danh mục rỗng có 0 dòng và 0 thông báo trạng thái rỗng. GUI chỉ hiện form và đầu bảng. [Ảnh C-21](evidence/C-21.png).
- **P-26.** **Kỳ vọng.** Có thông báo danh sách rỗng dễ phân biệt với lỗi tải. **Quan sát.** Sau khi dữ liệu tải xong, bảng coupon có 0 hàng nhưng không có thông báo danh sách rỗng. [Ảnh P-26](evidence/P-26.png).

### U1-06 · Phản hồi lỗi mạng khi thao tác Danh mục khó giúp người dùng khôi phục

**Căn cứ và phạm vi.** Phản hồi và phục hồi lỗi · Danh mục.
**Mức độ.** Thấp — Thông báo kỹ thuật tăng công sức chẩn đoán trong khi thao tác thất bại.

**Tái hiện**

1. Mở Danh mục trong sandbox và nhập một tên dùng một lần.
2. Chặn yêu cầu POST tạo danh mục ở trình duyệt rồi bấm Thêm mới.
3. Ghi nội dung hộp thoại và quan sát dữ liệu, trường nhập sau khi đóng hộp thoại.

**Kỳ vọng và quan sát**

- **C-16.** **Kỳ vọng.** UI báo thao tác thất bại dễ hiểu và có hướng sửa/thử lại; tên chưa được tạo. **Quan sát.** GUI chỉ hiện “Lỗi thêm DM: Network Error”, không cho biết cách khôi phục. Form vẫn giữ tên đã nhập. [Ảnh C-16](evidence/C-16.png).

Đây là đánh giá giao diện khi mất kết nối được chủ động tái hiện. Thông báo native được ghi bằng log sự kiện; ảnh ghi trạng thái trang sau khi đóng.

### U1-07 · Chữ trên nút Xóa Danh mục có tương phản thấp

**Căn cứ và phạm vi.** Ngưỡng tương phản đã chọn 4,5:1 cho chữ thường · Danh mục.
**Mức độ.** Trung bình — Nhãn nút thao tác có thể khó đọc với người nhìn kém.

**Tái hiện**

1. Mở Danh mục và quan sát nút Xóa trên hàng đầu.
2. Đọc màu chữ và màu nền tính toán, tính tỷ lệ tương phản rồi đối chiếu ngưỡng 4,5:1.

**Kỳ vọng và quan sát**

- **S-04.** **Kỳ vọng.** Chữ thường đạt tối thiểu 4.5:1, chữ lớn tối thiểu 3:1. **Quan sát.** Nút Xóa có chữ rgb(255, 255, 255) trên nền rgb(239, 68, 68), tỷ lệ 3.76:1, dưới 4,5:1. [Ảnh S-04](evidence/S-04.png).

Phép đo tập trung vào mẫu nút Xóa được ghi trong log, chưa suy rộng sang toàn bộ màn hình.

## Quan sát bố cục sau khi kiểm lại

### U1-08 · Điều khiển trên bảng hoặc form bị đẩy ra ngoài vùng nhìn hẹp

**Căn cứ và phạm vi.** Responsive và khả năng tiếp cận · Web Admin.
**Ảnh hưởng quan sát được.** Ô tên danh mục bị cắt một phần và form coupon rất hẹp, khiến nội dung khó đọc hơn. Các thao tác chính vẫn thực hiện được sau cuộn trong lượt kiểm riêng.

**Tái hiện**

1. Đặt viewport Chrome thành 375 × 812 CSS px. Mở lần lượt Dashboard, Danh mục, Mã Giảm Giá để đo vùng nội dung.
2. Mở lại Danh mục và cuộn tới ô Tên danh mục mới. So kích thước và vị trí toàn bộ ô với phần nội dung còn thấy.
3. Thử cuộn ngang bằng chuột và Tab tới trường để xác nhận khả năng nhập, đọc và gửi form.

**Kỳ vọng và quan sát**

- **S-06.** **Kỳ vọng.** Nội dung và thao tác chính có thể tiếp cận, không bị chồng lấn hoặc cắt mất khỏi vùng cuộn. **Quan sát.** Ở 375 px, điều khiển “Tên danh mục mới” ở Danh mục vẫn bị cắt sau khi cuộn tới; chiều rộng hiển thị/nội dung: Dashboard: 119/154, Danh mục: 119/319, Mã Giảm Giá: 119/568. [Ảnh S-06](evidence/S-06.png).

Ảnh và số đo ghi phần ô còn bị cắt sau `scrollIntoViewIfNeeded`. Ở lượt kiểm lại, thêm, xem và xóa được danh mục và coupon ở 375 px sau cuộn. S-06 được ghi Passed theo tiêu chí thao tác trong preview. [Log thao tác](automation/recheck-results.json).

## Phát hiện từ mục đề xuất AI

### A-01 và A-02 · Form lưu coupon khi người dùng xóa giá trị mặc định

Thử từng ô với một mã coupon riêng và điền hợp lệ các trường còn lại. Khi xóa số 0 ở ô Đơn tối thiểu, POST trả HTTP 200 và hệ thống lưu chuỗi rỗng. Khi xóa số 1 ở ô Số lần dùng tối đa/người, hệ thống tự lưu 1 mà không hiện giá trị này trước khi tạo. Hai phép kiểm thất bại theo tiêu chí đã ghi trong preview. A-02 quan sát cách giao diện thể hiện mặc định, còn giá trị 1 đã lưu đáp ứng giới hạn số của FR-17. [Ảnh A-01](evidence/recheck/A-01.png), [ảnh A-02](evidence/recheck/A-02.png) và [log kiểm lại](automation/recheck-results.json).

### A-05 · Coupon lưu được mã toàn dấu cách

Trên cơ sở dữ liệu thử, nhập ba dấu cách vào ô mã coupon và điền hợp lệ các trường còn lại. Sau khi bấm Tạo mã, POST trả HTTP 200, mã ba dấu cách được lưu và hàng mới có ô mã trông như trống. Tiêu chí đề xuất là từ chối mã toàn dấu cách và hướng dẫn sửa. Ca bổ sung đã được chấp thuận theo heuristic. [Ảnh A-05](evidence/recheck/A-05.png) · [Log kiểm lại](automation/recheck-results.json).

## GitHub Issues đã ghi nhận

| Ca kiểm thử | GitHub Issue | Ghi nhận |
|---|---|---|
| D-07 | [#23](https://github.com/nguyenanhtuan2702/eshop-sut/issues/23) | Bổ sung ảnh và kết quả tái hiện |
| C-06, C-07 | [#75](https://github.com/nguyenanhtuan2702/eshop-sut/issues/75) | Bổ sung ảnh và kết quả tái hiện |
| P-11, P-12 | [#8](https://github.com/nguyenanhtuan2702/eshop-sut/issues/8) | Bổ sung ảnh và kết quả tái hiện |
| P-13 | [#9](https://github.com/nguyenanhtuan2702/eshop-sut/issues/9) | Bổ sung ảnh và kết quả tái hiện |
| C-05, P-06, C-04, P-05 | [#158](https://github.com/nguyenanhtuan2702/eshop-sut/issues/158) | Issue mới kèm ảnh |
| P-21, P-08 | [#159](https://github.com/nguyenanhtuan2702/eshop-sut/issues/159) | Issue mới kèm ảnh |
| S-02 | [#160](https://github.com/nguyenanhtuan2702/eshop-sut/issues/160) | Issue mới kèm ảnh |
| S-03 | [#161](https://github.com/nguyenanhtuan2702/eshop-sut/issues/161) | Issue mới kèm ảnh |
| D-05 | [#162](https://github.com/nguyenanhtuan2702/eshop-sut/issues/162) | Issue mới kèm ảnh |
| S-08 | [#163](https://github.com/nguyenanhtuan2702/eshop-sut/issues/163) | Issue mới kèm ảnh |
| C-17, P-22 | [#164](https://github.com/nguyenanhtuan2702/eshop-sut/issues/164) | Issue mới kèm ảnh |
| C-15 | [#165](https://github.com/nguyenanhtuan2702/eshop-sut/issues/165) | Issue mới kèm ảnh |
| D-10, S-11 | [#166](https://github.com/nguyenanhtuan2702/eshop-sut/issues/166) | Issue mới kèm ảnh |
| C-21, P-26 | [#167](https://github.com/nguyenanhtuan2702/eshop-sut/issues/167) | Issue mới kèm ảnh |
| C-16 | [#168](https://github.com/nguyenanhtuan2702/eshop-sut/issues/168) | Issue mới kèm ảnh |
| S-04 | [#169](https://github.com/nguyenanhtuan2702/eshop-sut/issues/169) | Issue mới kèm ảnh |
| A-01, A-02 | [#170](https://github.com/nguyenanhtuan2702/eshop-sut/issues/170) | Issue mới kèm ảnh |
| A-05 | [#171](https://github.com/nguyenanhtuan2702/eshop-sut/issues/171) | Issue mới kèm ảnh |
