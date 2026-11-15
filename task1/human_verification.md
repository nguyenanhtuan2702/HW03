# HW03 Task 1 · Xác minh kết quả kiểm thử

Tài liệu tổng hợp quyết định đề xuất và lý do theo log, ảnh và các lượt kiểm lại. Tìm nhanh bằng mã mục, ví dụ `D-07`.

**Nguồn rà soát** Các quyết định đề xuất được tổng hợp với AI từ bằng chứng Task 1. Kết quả Narrator ở A-08 do sinh viên trực tiếp báo.

**Mục lục**

- [Chuẩn bị và nguồn đối chiếu](#1-chuẩn-bị-và-nguồn-đối-chiếu)
- [Sai lệch theo đặc tả (P0)](#2-sai-lệch-theo-đặc-tả-p0)
- [Usability và cách diễn giải (P1)](#3-usability-và-cách-diễn-giải-p1)
- [Ca bị chặn và mẫu đã đạt (P2)](#4-ca-bị-chặn-và-mẫu-đã-đạt-p2)
- [Kiểm tra trực quan và thao tác (P2)](#5-kiểm-tra-trực-quan-và-thao-tác-p2)
- [Duyệt tiêu chí đã chỉnh (P3)](#6-duyệt-tiêu-chí-đã-chỉnh-p3)
- [Duyệt mục bổ sung (P4)](#7-duyệt-mục-bổ-sung-p4)
- [Ca kiểm thủ công bổ sung](#8-ca-kiểm-thủ-công-bổ-sung)

## 1. Chuẩn bị và nguồn đối chiếu

- Dùng bản chạy cách ly mô tả trong [môi trường kiểm thử](environment.md) và các lệnh trong [báo cáo Task 1](gui_checklist_report.md). Các bước kiểm dùng tài khoản demo của sandbox. Các ca trạng thái đang tải và mất kết nối chủ động thay đổi thời điểm tải dữ liệu.
- Dùng dữ liệu thử duy nhất và chỉ xóa dữ liệu do chính lượt thử tạo. Khi cần danh sách rỗng hoặc đơn hàng đối chứng, chạy fixture cách ly. Tập fixture thật phục vụ thiết lập và đối chiếu; thao tác kiểm tra đi qua trình duyệt.
- [Thiết kế của lượt gốc](automation/checklist-review.json) chứa điều kiện, dữ liệu và cách quan sát. [Bản ghi lần chạy](automation/results.json) chứa bước thực tế, quan sát, thời gian, lỗi tự động hóa nếu có và đường dẫn ảnh. Với hộp thoại native, đọc thêm sự kiện `dialogs` vì ảnh vùng nội dung trang có thể không ghi hộp thoại của trình duyệt.

Bản ghi gốc `HW03-MW9D83SL` hoàn tất 2026-11-09T21:38:59.785+07:00. Xem [bản ghi kiểm lại ngày 13/11](automation/recheck-results.json) cho S-05, S-06 và các mục đề xuất đã kiểm riêng. Các dòng quyết định ghi phương án đề xuất và căn cứ.

## 2. Sai lệch theo đặc tả (P0)

Các mục dưới đây có căn cứ yêu cầu trực tiếp. S-03 ghi riêng số lượng h1 và khả năng mô tả từng màn.

### D-07 · Doanh thu đúng với đơn đã giao

**Quan sát đã ghi** Dashboard hiển thị 493.620 ₫; tổng đối chiếu của riêng đơn đã giao là 246810 ₫.

**Chấp nhận khi** Doanh thu bằng tổng total_amount của các đơn delivered.

- **Chuẩn bị** Sandbox riêng có ít nhất một delivered dương và một đơn trạng thái khác dương. Hai hoặc nhiều đơn có tổng tiền và trạng thái biết trước.
- **Tái hiện** Đợi dữ liệu orders tải xong, mở Dashboard và ghi giá trị doanh thu.
- **Căn cứ và lý do xác nhận** FR-13. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh D-07](evidence/D-07.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-13. Tổng đơn đã giao là 246.810 ₫, Dashboard hiển thị 493.620 ₫.

### C-06 · Không chấp nhận tên rỗng

**Quan sát đã ghi** Tên "" được lưu. Dòng #5 xuất hiện với ô tên "".

**Chấp nhận khi** Không tạo hàng tên rỗng; giao diện chỉ rõ tên là bắt buộc.

- **Chuẩn bị** Sandbox có thể nhận một bản ghi sai; có baseline ID trước test. Tên chuỗi rỗng.
- **Tái hiện** Xóa nội dung, nhấn Thêm mới, đợi dữ liệu ổn định và so hàng.
- **Căn cứ và lý do xác nhận** FR-14. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh C-06](evidence/C-06.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-14. Gửi tên rỗng tạo thành công một hàng không có tên.

### P-11 · Giá trị giảm không nhận số 0

**Quan sát đã ghi** Form chấp nhận giá trị giảm 0 và POST trả HTTP 200, mã HW03-MW9D83SL-P-11-GUI xuất hiện trong bảng.

**Chấp nhận khi** Không tạo coupon giá trị 0; có hướng dẫn phù hợp.

- **Chuẩn bị** Sandbox, form coupon. Mã duy nhất; giá trị 0; trường còn lại hợp lệ.
- **Tái hiện** Gửi rồi quan sát phản hồi và bảng sau ổn định.
- **Căn cứ và lý do xác nhận** FR-17. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh P-11](evidence/P-11.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-17. Giá trị giảm phải dương, nhưng form lưu được giá trị 0.

### P-12 · Giá trị giảm không nhận số âm

**Quan sát đã ghi** Form chấp nhận giá trị giảm -10 và POST trả HTTP 200, mã HW03-MW9D83SL-P-12-GUI xuất hiện trong bảng.

**Chấp nhận khi** Không tạo coupon giá trị âm; có hướng dẫn phù hợp.

- **Chuẩn bị** Sandbox, form coupon. Mã duy nhất; giá trị -10; trường khác hợp lệ.
- **Tái hiện** Gửi và quan sát phản hồi/bảng.
- **Căn cứ và lý do xác nhận** FR-17. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh P-12](evidence/P-12.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-17. Form lưu được giá trị giảm −10.

### P-13 · Đơn tối thiểu không nhận số âm

**Quan sát đã ghi** Form chấp nhận đơn tối thiểu -1 ₫ và POST trả HTTP 200, mã HW03-MW9D83SL-P-13-GUI xuất hiện trong bảng.

**Chấp nhận khi** Không tạo coupon với đơn tối thiểu dưới 0.

- **Chuẩn bị** Sandbox, form coupon. Mã duy nhất; đơn tối thiểu -1; trường khác hợp lệ.
- **Tái hiện** Gửi và quan sát phản hồi/bảng.
- **Căn cứ và lý do xác nhận** FR-17. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh P-13](evidence/P-13.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-17. Form lưu được đơn tối thiểu −1 ₫ dù ngưỡng hợp lệ từ 0 ₫.

### S-02 · Màu hành động nhất quán

**Quan sát đã ghi** Thêm mới rgb(37, 99, 235); Xóa rgb(239, 68, 68); Tạo mã rgb(249, 115, 22) (cam, sai màu xanh dương của FR-21).

**Chấp nhận khi** Nút hành động tích cực màu xanh dương; nút xóa màu đỏ.

- **Chuẩn bị** Danh mục và Mã giảm giá đã tải, mỗi bảng có ít nhất một hàng. Nút Thêm mới, Tạo mã và Xóa của hai bảng.
- **Tái hiện** Mở hai tab và đọc màu nền tính toán của từng nút đang thấy.
- **Căn cứ và lý do xác nhận** FR-21. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh S-02](evidence/S-02.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-21. Nút Tạo mã là hành động tích cực nhưng dùng màu cam.

### C-05 · Đánh dấu trường bắt buộc

**Quan sát đã ghi** Form thêm danh mục không có nhãn tên kèm dấu \*.

**Chấp nhận khi** Có dấu \* bên cạnh nhãn trường bắt buộc.

- **Chuẩn bị** Form Danh mục đang thấy. Ô tên danh mục bắt buộc.
- **Tái hiện** Quan sát nhãn tên danh mục.
- **Căn cứ và lý do xác nhận** FR-22, FR-14. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh C-05](evidence/C-05.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-22. Ô tên danh mục là bắt buộc và không có dấu * bên cạnh nhãn.

### P-06 · Trường bắt buộc được đánh dấu \*

**Quan sát đã ghi** Form không gắn dấu \* cạnh nhãn cho các trường bắt buộc FR-17: code, type, value, minimum, date, uses.

**Chấp nhận khi** Mỗi trường bắt buộc có dấu \* cạnh nhãn.

- **Chuẩn bị** Form coupon đang thấy. Sáu trường FR-17.
- **Tái hiện** Quan sát nhãn và đánh dấu bắt buộc.
- **Căn cứ và lý do xác nhận** FR-22, FR-17. Chạy độc lập với dữ liệu thử để xác nhận phạm vi sai lệch theo yêu cầu.
- **Minh chứng** [Ảnh P-06](evidence/P-06.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo FR-22. Các trường coupon bắt buộc thiếu dấu * bên cạnh nhãn.

### P-21 · Lỗi tạo coupon được giải thích

**Quan sát đã ghi** Tạo mã trùng trả HTTP 500. Sau khi đóng hộp thoại “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code”, form không hiển thị thông báo lỗi phía trên nút Tạo mã.

**Chấp nhận khi** Thông báo lỗi hiển thị trong giao diện phía trên nút Tạo mã.

- **Chuẩn bị** Coupon thử cùng mã đã tồn tại. Mã trùng và tất cả trường còn lại hợp lệ.
- **Tái hiện** Gửi lại; ghi alert nếu có, đóng alert để xem thông báo cạnh form.
- **Căn cứ và lý do xác nhận** FR-22. Chốt vị trí thông báo so với nút Tạo mã, tách vị trí khỏi khả năng hiểu nội dung lỗi ở P-08.
- **Minh chứng** [Ảnh P-21](evidence/P-21.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json). Xem thêm trường `dialogs` của ID này.

> **Quyết định và lý do** Giữ Failed theo FR-22. Khi tạo mã trùng, thông báo xuất hiện trong hộp thoại, phía trên nút Tạo mã không có thông báo sau khi đóng hộp thoại.

### S-03 · Phân cấp tiêu đề dễ hiểu

**Quan sát đã ghi** Mỗi màn hình có một h1 chung “EShop Admin”. Nội dung từng màn chỉ có ở h2 (Dashboard, Quản lý Danh mục, Quản lý Mã Giảm Giá).

**Chấp nhận khi** Mỗi trang có đúng một h1 mô tả nội dung trang.

- **Chuẩn bị** Đã đăng nhập; ba view khả dụng. Dashboard, Danh mục, Mã giảm giá.
- **Tái hiện** Mở từng view, đọc số lượng và nội dung h1 hiện hành cùng tên heading nội dung.
- **Căn cứ và lý do xác nhận** FR-21 được áp dụng theo nội dung từng màn. Ảnh và DOM cho thấy mỗi màn có một h1 chung, còn tên màn xuất hiện ở h2.
- **Minh chứng** [Ảnh S-03](evidence/S-03.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. H1 chung nhận diện ứng dụng, trong khi nội dung từng màn chỉ được mô tả ở h2.

## 3. Usability và cách diễn giải (P1)

Rà các thất bại còn lại theo bối cảnh sử dụng. Chấp nhận hay bác bỏ theo tiêu chí có căn cứ, rồi gộp nguyên nhân chung trong báo cáo lỗi nếu thích hợp.

### C-04 · Trường tên danh mục có nhãn

**Quan sát đã ghi** Ô tên chỉ có placeholder “Tên danh mục mới”, không có nhãn hiển thị cố định hoặc label liên kết.

**Chấp nhận khi** Ô có nhãn thấy được và tên truy cập có thể nhận diện sau khi nhập.

- **Chuẩn bị** Form Danh mục đang thấy. Ô tên danh mục.
- **Tái hiện** Kiểm tra nhãn khi rỗng và sau khi nhập tên thử, không gửi.
- **Căn cứ và lý do xác nhận** Nhãn bền vững và liên kết trường. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh C-04](evidence/C-04.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí nhận diện trường. Ô tên chỉ có placeholder, mất gợi ý khi nhập và thiếu nhãn liên kết.

### C-07 · Không chấp nhận toàn khoảng trắng

**Quan sát đã ghi** Tên `"   "` được lưu. Dòng #6 xuất hiện với ô tên `"   "`.

**Chấp nhận khi** Tên không có ký tự nhìn thấy bị từ chối và người dùng biết cần sửa tên.

- **Chuẩn bị** Sandbox; biết tập ID trước khi thử. Ba ký tự ASCII space.
- **Tái hiện** Nhập toàn khoảng trắng, gửi và quan sát phản hồi/hàng mới.
- **Căn cứ và lý do xác nhận** Suy luận từ FR-14 về tên có nội dung. Chốt khoảng trắng được diễn giải như tên trống hay được ghi là vấn đề validation/usability dẫn xuất từ FR-14.
- **Minh chứng** [Ảnh C-07](evidence/C-07.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí tên có nội dung. Hệ thống lưu được tên gồm ba dấu cách.

### C-15 · Chống gửi trùng lúc đang tạo

**Quan sát đã ghi** Hai lần bấm trong lúc chờ tạo 2 dòng cùng tên. Ghi nhận 2 yêu cầu POST.

**Chấp nhận khi** Một ý định tạo dẫn đến tối đa một bản ghi khi bấm lặp trong lúc đang xử lý.

- **Chuẩn bị** Sandbox; chuẩn bị cơ chế giữ một request thật pending. Tên duy nhất, bấm lần hai khi POST đầu còn pending.
- **Tái hiện** Điền tên, gửi, bấm lại trước khi request đầu hoàn tất rồi cho hoàn tất.
- **Căn cứ và lý do xác nhận** Ngăn gửi trùng ngoài ý muốn. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh C-15](evidence/C-15.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. Bấm Thêm mới liên tiếp khi yêu cầu còn chờ tạo hai bản ghi.

### C-16 · Lỗi thêm danh mục được giải thích

**Quan sát đã ghi** GUI chỉ hiện “Lỗi thêm DM: Network Error”, không cho biết cách khôi phục. Form vẫn giữ tên đã nhập.

**Chấp nhận khi** UI báo thao tác thất bại dễ hiểu và có hướng sửa/thử lại; tên chưa được tạo.

- **Chuẩn bị** Sandbox đã tải Danh mục; ngắt kết nối phiên trình duyệt. Tên hợp lệ duy nhất.
- **Tái hiện** Gửi tên trong phiên đã ngắt; ghi phản hồi và kiểm tên không được thêm sau khôi phục.
- **Căn cứ và lý do xác nhận** Khả năng phục hồi lỗi tạo qua GUI. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh C-16](evidence/C-16.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json). Xem thêm trường `dialogs` của ID này.

> **Quyết định và lý do** Giữ Failed theo tiêu chí phản hồi lỗi. Hộp thoại báo lỗi mạng nhưng thiếu hướng khôi phục. Tên đã nhập vẫn còn.

### C-17 · Xác nhận trước khi xóa

**Quan sát đã ghi** Một lần bấm Xóa gửi DELETE và làm mất dòng #15 ngay. Không có hộp thoại xác nhận.

**Chấp nhận khi** Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn tương đương trước khi xóa.

- **Chuẩn bị** Danh mục thử đã tạo bởi lượt chạy. Tên/ID của danh mục thử.
- **Tái hiện** Bấm Xóa, quan sát giao diện và request trước khi chọn xác nhận.
- **Căn cứ và lý do xác nhận** An toàn thao tác phá hủy, không nêu trong FR-14. Xác nhận giá trị bảo vệ thao tác phá hủy trong ngữ cảnh quản trị. FR-14 mô tả chức năng xóa, còn xác nhận là heuristic.
- **Minh chứng** [Ảnh C-17](evidence/C-17.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí an toàn thao tác xóa. Một lần bấm Xóa đã gửi yêu cầu và làm hàng biến mất.

### C-21 · Empty state khi không có danh mục

**Quan sát đã ghi** Danh mục rỗng có 0 dòng và 0 thông báo trạng thái rỗng. GUI chỉ hiện form và đầu bảng.

**Chấp nhận khi** Có thông báo không có danh mục, người dùng nhận biết có thể thêm mới.

- **Chuẩn bị** Sandbox hoặc fixture dữ liệu thật riêng có 0 danh mục. GET categories trả danh sách rỗng.
- **Tái hiện** Mở Danh mục và đợi request hoàn tất.
- **Căn cứ và lý do xác nhận** Trạng thái rỗng có thể nhận diện. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh C-21](evidence/C-21.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí trạng thái rỗng. API trả danh sách rỗng nhưng bảng không có thông báo giải thích.

### P-05 · Mỗi trường có nhãn dễ hiểu

**Quan sát đã ghi** Các điều khiển không có nhãn bền vững: Mã coupon (VD: SAVE10), SELECT, Giá trị % (VD: 10), Đơn tối thiểu (₫), Ngày hết hạn, Số lần dùng tối đa/người. Placeholder hoặc lựa chọn hiện tại không thay thế nhãn.

**Chấp nhận khi** Mỗi trường có nhãn nhận diện được sau khi nhập và tên truy cập phù hợp.

- **Chuẩn bị** Form coupon hiện hữu. Sáu trường tạo mã.
- **Tái hiện** Quan sát trước/sau điền, kiểm label/accessible name từng trường.
- **Căn cứ và lý do xác nhận** Nhãn bền vững và tên truy cập. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh P-05](evidence/P-05.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí nhãn trường. Các trường thiếu nhãn liên kết và gợi ý dạng placeholder biến mất sau nhập.

### P-08 · Code trùng được báo rõ

**Quan sát đã ghi** Mã HW03-MW9D83SL-P-08-DUP được giữ một bản ghi, nhưng thông báo giao diện là “Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code” thay vì giải thích rõ mã đã tồn tại.

**Chấp nhận khi** Mã trùng bị từ chối; phản hồi chỉ rõ mã đã tồn tại.

- **Chuẩn bị** Coupon duy nhất do lượt test tạo đã có sẵn. Mã trùng chính xác và trường khác hợp lệ.
- **Tái hiện** Gửi lại cùng mã, ghi thông báo và đếm hàng.
- **Căn cứ và lý do xác nhận** FR-17 (duy nhất); heuristic phản hồi. Xác nhận khả năng hiểu thông báo kỹ thuật. Việc từ chối và giữ một bản ghi đã được kiểm, vì vậy phần cần duyệt là chất lượng phản hồi.
- **Minh chứng** [Ảnh P-08](evidence/P-08.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json). Xem thêm trường `dialogs` của ID này.

> **Quyết định và lý do** Giữ Failed về phản hồi. Hệ thống chặn mã trùng nhưng hiển thị lỗi SQLite thay vì giải thích rằng mã đã tồn tại.

### P-22 · Xác nhận trước khi xóa coupon

**Quan sát đã ghi** Bấm Xóa một lần đã xóa HW03-MW9D83SL-P-22-CONFIRM và cập nhật bảng, không có hộp thoại xác nhận.

**Chấp nhận khi** Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn trước khi xóa.

- **Chuẩn bị** Mã do lượt test tạo và nhìn thấy được. Mã/ID thử.
- **Tái hiện** Bấm Xóa và quan sát trước xác nhận.
- **Căn cứ và lý do xác nhận** An toàn thao tác phá hủy, không nêu trong FR-17. Xác nhận giá trị bảo vệ thao tác phá hủy trong ngữ cảnh quản trị. FR-17 mô tả chức năng xóa, còn xác nhận là heuristic.
- **Minh chứng** [Ảnh P-22](evidence/P-22.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí an toàn thao tác xóa. Coupon biến mất ngay khi bấm Xóa, thiếu bước xác nhận.

### P-26 · Empty state danh sách coupon

**Quan sát đã ghi** Sau khi dữ liệu tải xong, bảng coupon có 0 hàng nhưng không có thông báo danh sách rỗng.

**Chấp nhận khi** Có thông báo danh sách rỗng dễ phân biệt với lỗi tải.

- **Chuẩn bị** Sandbox/fixture có 0 coupon. GET coupons trả [].
- **Tái hiện** Mở Mã giảm giá, đợi dữ liệu tải xong.
- **Căn cứ và lý do xác nhận** Trạng thái rỗng có thể nhận diện. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh P-26](evidence/P-26.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed theo tiêu chí trạng thái rỗng. Sau tải, bảng coupon không có hàng và thiếu thông báo danh sách rỗng.

### D-05 · Nhãn trạng thái dùng ngôn ngữ phù hợp

**Quan sát đã ghi** Nhãn “Tổng doanh thu (Delivered)” dùng “Delivered” cho trạng thái đã giao, trong khi các nhãn trạng thái dành cho người dùng tiếng Việt.

**Chấp nhận khi** Hậu tố nếu có diễn đạt trạng thái giao thành công dễ hiểu, ưu tiên nhãn “Đã giao”.

- **Chuẩn bị** Dashboard đã tải. Hậu tố trong nhãn tổng doanh thu.
- **Tái hiện** Đọc hậu tố và đối chiếu cách diễn đạt Việt ngữ.
- **Căn cứ và lý do xác nhận** FR-21. Xác định Delivered có được xem là thuật ngữ kỹ thuật chuẩn trong nhãn đối với người quản trị Việt Nam hay cần bản dịch.
- **Minh chứng** [Ảnh D-05](evidence/D-05.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. “Delivered” là nhãn trạng thái nghiệp vụ và có bản dịch “Đã giao”.

### D-10 · Loading khi tải dữ liệu

**Quan sát đã ghi** Khi GET đơn hàng chưa được chuyển đi, giao diện đã hiển thị 0 ₫ và 0 và không có trạng thái đang tải nhận biết được.

**Chấp nhận khi** Có dấu hiệu đang tải hoặc trạng thái tạm đủ rõ để tránh hiểu nhầm là số 0 đã tải.

- **Chuẩn bị** Sandbox có đơn; phiên đã đăng nhập; dùng throttle hoặc giữ request thật ở trạng thái pending. Dữ liệu Dashboard khác 0.
- **Tái hiện** Reload Dashboard, quan sát trong lúc request thực đang pending và sau khi tải.
- **Căn cứ và lý do xác nhận** Phân biệt đang tải với dữ liệu thật. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh D-10](evidence/D-10.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. Trong lúc yêu cầu đơn hàng đang chờ, hai thẻ hiển thị 0 như dữ liệu đã tải.

### S-04 · Độ tương phản chữ và nền

**Quan sát đã ghi** Nút Xóa có chữ rgb(255, 255, 255) trên nền rgb(239, 68, 68), tỷ lệ 3.76:1, dưới 4,5:1.

**Chấp nhận khi** Chữ thường đạt tối thiểu 4.5:1, chữ lớn tối thiểu 3:1.

- **Chuẩn bị** Ba màn ở trạng thái mặc định; có công cụ lấy màu chữ và nền. Nhãn active, heading thẻ doanh thu, nút Tạo mã, placeholder danh mục.
- **Tái hiện** Lấy từng cặp màu hiệu dụng, cỡ/chữ đậm và tính tỷ lệ.
- **Căn cứ và lý do xác nhận** Độ tương phản, ngưỡng 4.5:1 chữ thường, 3:1 chữ lớn. Xem lại màu hiệu dụng, cỡ chữ và ngưỡng so sánh; phép đo đã chạy ở nút Xóa là mẫu đại diện.
- **Minh chứng** [Ảnh S-04](evidence/S-04.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed cho mẫu nút Xóa. Chữ trắng cỡ nhỏ trên nền đỏ có tỷ lệ 3,76:1, dưới ngưỡng 4,5:1.

### S-06 · Bố cục trên chiều rộng 375 px

**Quan sát đã ghi** Ở 375 px, điều khiển “Tên danh mục mới” ở Danh mục vẫn bị cắt sau khi cuộn tới; chiều rộng hiển thị/nội dung: Dashboard: 119/154, Danh mục: 119/319, Mã Giảm Giá: 119/568.

**Kiểm lại · Passed** Ở 375 px, mở được ba màn và thêm, xem, xóa được cả danh mục và coupon sau cuộn. Ô tên danh mục vẫn bị cắt một phần và form coupon hẹp. [Bản ghi thao tác](automation/recheck-results.json).

**Chấp nhận khi** Sau khi cuộn khi cần, có thể tiếp cận và hoàn thành thao tác chính trên ba màn ở 375 CSS px.

- **Chuẩn bị** Chromium ở 100%, viewport 375×812 CSS px. Dashboard, Danh mục, Mã giảm giá; một hàng thử mỗi bảng.
- **Tái hiện** Đặt viewport hẹp, mở từng tab; cuộn nội dung khi cần tới các trường/nút/hàng cuối.
- **Căn cứ và lý do xác nhận** Responsive ở chiều rộng 375 CSS px. Thử cuộn bằng cả chuột và bàn phím ở 375 px. Phân biệt có overflow với điều khiển bị cắt ngay cả khi đã đưa tới vùng nhìn thấy.
- **Minh chứng** [Ảnh S-06](evidence/S-06.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Passed theo tiêu chí thao tác ở 375 px. Sau cuộn, thêm, xem và xóa được danh mục và coupon. Giữ ảnh ô nhập bị cắt làm quan sát bố cục.

### S-08 · Menu có thể dùng bàn phím

**Quan sát đã ghi** Tab không focus được bất kỳ mục menu đích nào. Focus thực tế: BODY → BODY → BODY → BODY → BODY → BODY → BODY → BODY.

**Chấp nhận khi** Có thể tới và mở cả ba màn bằng bàn phím.

- **Chuẩn bị** Đã đăng nhập; bắt đầu không focus vào menu. Dashboard, Danh mục, Mã giảm giá.
- **Tái hiện** Dùng Tab để tìm các mục; thử Enter hoặc Space khi mục có focus.
- **Căn cứ và lý do xác nhận** Điều hướng tương tác bằng bàn phím. Tự bắt đầu từ trang mới và dùng bàn phím thật để phân biệt hành vi focus của trang với hành vi của thanh địa chỉ hoặc công cụ tự động.
- **Minh chứng** [Ảnh S-08](evidence/S-08.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. Lượt dùng Tab không đưa focus tới mục menu để mở ba màn bằng bàn phím.

### S-11 · Phản hồi khi Backend không kết nối

**Quan sát đã ghi** GET /api/admin/users thất bại; Dashboard vẫn hiển thị “0 ₫” và “0” mà không có thông báo lỗi.

**Chấp nhận khi** View phân biệt lỗi kết nối với dữ liệu rỗng và thông báo tình trạng hoặc hướng phục hồi.

- **Chuẩn bị** Phiên đã đăng nhập và giữ token; thử trên sandbox hoặc trình duyệt riêng. Dữ liệu có sẵn trước khi gián đoạn.
- **Tái hiện** Ngắt kết nối trình duyệt thật ở phiên thử, tải lại view và quan sát sau khi request thất bại.
- **Căn cứ và lý do xác nhận** Trạng thái kết nối và phản hồi lỗi. Xem xét mức ảnh hưởng và ngưỡng heuristic trong công việc của quản trị viên.
- **Minh chứng** [Ảnh S-11](evidence/S-11.png) · [bước thực tế, nhật ký và thời điểm](automation/results.json).

> **Quyết định và lý do** Giữ Failed. Khi yêu cầu tải dữ liệu thất bại, Dashboard vẫn hiển thị 0 và không báo lỗi kết nối.

## 4. Ca bị chặn và mẫu đã đạt (P2)

### Mục Blocked và mục bổ sung bằng chứng

#### C-18 · Blocked

- **Điểm cần xử lý** Blocked · Không có bước xác nhận để chọn Hủy. Xem C-17.
- **Tái hiện** Bấm Xóa rồi chọn Hủy nếu khả dụng.
- **Chấp nhận khi** Danh mục vẫn tồn tại và không gửi lệnh xóa.
- **Minh chứng** [C-17](evidence/C-17.png) · [bản ghi](automation/results.json)

> **Quyết định và lý do** Giữ Blocked vì UI thiếu bước Hủy. Theo dõi thiếu xác nhận ở C-17.

#### P-23 · Blocked

- **Điểm cần xử lý** Blocked · Không có hộp thoại xác nhận để thực hiện thao tác Hủy (xem P-22).
- **Tái hiện** Bấm Xóa, chọn Hủy nếu có.
- **Chấp nhận khi** Mã còn và không gửi DELETE.
- **Minh chứng** [P-22](evidence/P-22.png) · [bản ghi](automation/results.json)

> **Quyết định và lý do** Giữ Blocked vì UI thiếu bước Hủy. Theo dõi thiếu xác nhận ở P-22.

#### S-05 · Passed khi kiểm lại

- **Quan sát** Chromium xác nhận zoom gốc 200%. Mở được ba màn và cuộn tới vị trí bấm được các điều khiển chính. Log gốc ghi Not Run vì chưa có phép thử này.
- **Tái hiện** Tăng zoom qua trình duyệt lên 200%, quan sát và truy cập nút/tab; hoàn nguyên 100%.
- **Chấp nhận khi** Nội dung và thao tác chính vẫn truy cập được; không có chồng lấn khiến thao tác bị che.
- **Minh chứng** [Thiết kế S-05](automation/checklist-review.json) · [log kiểm zoom](automation/recheck-results.json)

> **Quyết định và lý do** Giữ Passed. Chromium xác nhận zoom gốc 200% và các điều khiển chính vẫn tiếp cận được sau cuộn.

### Mẫu Passed cần kiểm độc lập

Các mẫu đại diện cho cả bốn IA. Kết quả C-03 và S-01 giới hạn trong viewport và nhãn đã kiểm.

#### S-01

- **Quan sát đã ghi** Tiêu đề: Dashboard; Quản lý Danh mục; Quản lý Mã Giảm Giá. Nhãn thao tác tiếng Việt; Dashboard được giữ như thuật ngữ quản trị, cần người review xác nhận ngoại lệ.
- **Phạm vi kiểm** Các nhãn đã quan sát trên ba màn. “Dashboard” được chấp nhận làm tên màn.
- **Tái hiện** Đi qua ba màn và ghi các chuỗi người quản trị nhìn thấy. Nhãn sidebar, tiêu đề, nút và thông báo thường dùng; bỏ qua hậu tố doanh thu của D-05.
- **Chấp nhận khi** Giao diện dùng tiếng Việt nhất quán, ngoại trừ thuật ngữ kỹ thuật chuẩn.

> **Quyết định và lý do** Giữ Passed cho mẫu nhãn đã kiểm. Chấp nhận “Dashboard” làm tên màn. Nhãn nghiệp vụ “Delivered” được chấm ở D-05.

#### C-03

- **Quan sát đã ghi** Nút Xóa cùng dòng tên dài hiện đầy đủ sau khi cuộn ở viewport 1440 px. Phép kiểm ghi nhận khả năng tiếp cận nút.
- **Phạm vi kiểm** Phép đo ghi vị trí nút Xóa cùng hàng tên dài sau khi cuộn.
- **Tái hiện** Tạo tên dài rồi quan sát hàng ở desktop và thử đến nút Xóa. Tên duy nhất ít nhất 120 ký tự với một đoạn dài không có dấu cách.
- **Chấp nhận khi** Tên có thể xem đầy đủ hoặc đọc qua phương thức rõ ràng; nút Xóa vẫn truy cập được và không bị che.

> **Quyết định và lý do** Giữ Passed trong viewport đã thử. Sau cuộn, hàng có tên dài và nút Xóa cùng hàng vẫn tiếp cận được.

#### S-07

- **Quan sát đã ghi** Mục hiện tại khác màu mục không hoạt động trên cả ba màn.
- **Phạm vi kiểm** Phép đo so sánh màu của mục đang chọn và các mục còn lại.
- **Tái hiện** Bấm lần lượt ba mục và kiểm tra style từng mục đang chọn và không chọn. Dashboard, Danh mục, Mã giảm giá.
- **Chấp nhận khi** Mục đang chọn được highlight và mục trước hết highlight.

> **Quyết định và lý do** Giữ Passed. Mục menu đang chọn có trạng thái hiển thị khác các mục còn lại trên cả ba màn.

#### D-08

- **Quan sát đã ghi** Dashboard hiển thị 1, khớp 1 đơn của tập dữ liệu.
- **Phạm vi kiểm** Tổng số đơn trên Dashboard được so với dữ liệu đối chiếu.
- **Tái hiện** Đọc số lượng ở Dashboard sau tải. Các đơn nhiều trạng thái.
- **Chấp nhận khi** Tổng số bằng số đơn tồn tại của mọi trạng thái.

> **Quyết định và lý do** Giữ Passed. Tổng số đơn hiển thị khớp dữ liệu đối chiếu, gồm các trạng thái đã kiểm.

#### C-08

- **Quan sát đã ghi** Dòng mới hiển thị đúng chữ tiếng Việt, dấu và ký tự gạch.
- **Phạm vi kiểm** Kiểm tên danh mục tiếng Việt có dấu và gạch nối.
- **Tái hiện** Nhập tên, gửi, tìm hàng tương ứng sau tải. Tên có mã lượt + “Đồ dùng học tập – thử nghiệm”.
- **Chấp nhận khi** Chữ có dấu và dấu gạch hiển thị đúng nội dung đã nhập.

> **Quyết định và lý do** Giữ Passed. Tên danh mục tiếng Việt có dấu được lưu và hiển thị đúng trong ca thử.

#### C-19

- **Quan sát đã ghi** Chỉ dòng #17 biến mất, các dòng còn lại giữ nguyên.
- **Phạm vi kiểm** So bản ghi bị xóa với hàng mục tiêu và các hàng đối chứng.
- **Tái hiện** Bấm Xóa đúng hàng, xác nhận nếu có và đợi bảng làm mới. Tên/ID duy nhất và danh sách ID trước xóa.
- **Chấp nhận khi** Chỉ hàng mục tiêu biến mất; các hàng khác giữ nguyên.

> **Quyết định và lý do** Giữ Passed. Hàng được chọn biến mất sau khi xóa, các hàng đối chứng vẫn còn.

#### P-03

- **Quan sát đã ghi** Coupon phần trăm hiển thị 10%, coupon cố định hiển thị 50.000 ₫ có phân nhóm nghìn và ký hiệu ₫.
- **Phạm vi kiểm** Kiểm ký hiệu và dấu phân nhóm số theo locale của lượt chạy.
- **Tái hiện** Đọc cột giá trị hai mã sau tải. Percent 10; fixed ít nhất 1.000 ₫.
- **Chấp nhận khi** Percent có %, tiền cố định có ₫ và phân nhóm hàng nghìn.

> **Quyết định và lý do** Giữ Passed. Coupon phần trăm hiển thị dấu %, coupon cố định hiển thị ₫ và có phân nhóm hàng nghìn.

#### P-20

- **Quan sát đã ghi** Coupon HW03-MW9D83SL-P-20-GUI xuất hiện đúng một lần với loại cố định, giá trị 12.345 ₫, tối thiểu 20.000 ₫, hạn 2099-12-31, giới hạn 2 lượt. Ca P-20 sau khi gộp A-03 cũng Passed ở lượt HW03-MWEY76JN. Cả sáu ô khớp, gồm đơn tối thiểu 0 ₫ và giới hạn 1 lần. [Log giá trị biên](automation/recheck-results.json).
- **Phạm vi kiểm** So sáu trường đã nhập với hàng đã lưu.
- **Tái hiện** Tạo qua GUI, đợi refresh; tìm hàng và đọc các cell. Mã duy nhất, loại, giá trị, đơn tối thiểu, ngày, số lượt hợp lệ.
- **Chấp nhận khi** Một hàng mới chứa mã và các trường đúng dữ liệu đã gửi.

> **Quyết định và lý do** Giữ Passed sau khi gộp A-03. Hàng xuất hiện đúng một lần và đủ sáu ô khớp, gồm đơn tối thiểu 0 ₫ và giới hạn 1 lượt.

Xem [nhật ký thực thi theo ID](automation/results.json). Mục Passed dùng bản ghi thay cho ảnh.

## 5. Kiểm tra trực quan và thao tác (P2)

Đối chiếu trạng thái và phép đo theo ID trong [bản ghi thực thi](automation/results.json). Kết quả của từng mẫu giới hạn trong điều khiển và dữ liệu đã quan sát.

### Ngoại lệ thuật ngữ và nội dung nhãn · S-01, D-05

- **Vì sao cần kiểm** Việc xem một chuỗi là thuật ngữ phù hợp cần hiểu bối cảnh người quản trị.
- **Tái hiện** Đọc tiêu đề, nhãn và hậu tố doanh thu ở cả ba màn. So với tiếng Việt trong đặc tả.
- **Chấp nhận khi** Ghi chuỗi chấp nhận/không chấp nhận, lý do và màn hình liên quan.

> **Quyết định và lý do** Chấp thuận cách chấm theo ngữ cảnh. Giữ “Dashboard” làm tên màn, ghi “Delivered” là nhãn trạng thái cần dịch thành “Đã giao”.

### Mẫu độ tương phản ngoài nút đã đo · S-04

- **Vì sao cần kiểm** Đo một nút chỉ cung cấp bằng chứng đại diện; cần xác định nền, cỡ và trọng lượng chữ của từng mẫu.
- **Tái hiện** Xem nút Xóa, Tạo mã, mục active, placeholder Danh mục và nhãn thẻ Dashboard; lấy màu chữ/nền hiệu dụng và tính tỷ lệ.
- **Chấp nhận khi** Xác nhận tỷ lệ chữ thường ít nhất 4,5:1 và chữ lớn ít nhất 3:1 theo ngưỡng đã chọn cho heuristic.

> **Quyết định và lý do** Giữ kết luận cho mẫu nút Xóa đã đo. Các thành phần còn lại cần có số đo riêng nếu mở rộng phạm vi kiểm.

### Zoom gốc 200% của trình duyệt · S-05

- **Kiểm lại** Passed. Chromium xác nhận zoom 200%, viewport CSS từ 1422×804 còn 711×402. [Minh chứng](automation/recheck-results.json).
- **Vì sao cần kiểm** Điều chỉnh viewport và kích thước CSS không chứng minh được hành vi zoom gốc.
- **Tái hiện** Từ zoom 100% ở desktop, đặt 200% trong menu trình duyệt, mở ba màn, đi tới nút/tab và cuối bảng; hoàn nguyên zoom.
- **Chấp nhận khi** Mọi tác vụ chính còn tới được; ghi chính xác phần bị chồng/cắt nếu có.

> **Quyết định và lý do** Chấp thuận phép kiểm zoom gốc 200% cho S-05. Ba màn mở được và các điều khiển chính vẫn tiếp cận được.

### Bố cục, khả năng cuộn và tên dài · S-06, D-04, P-04, C-03

- **Kiểm lại S-06** Hoàn thành luồng thao tác sau cuộn. Phần bố cục bị cắt được ghi làm quan sát về khả năng đọc. [Minh chứng](automation/recheck-results.json).
- **Vì sao cần kiểm** Hình học không phản ánh đầy đủ thao tác cuộn và việc đọc nội dung.
- **Tái hiện** Đặt đúng chiều rộng từng mục trong thiết kế; dùng chuột/bàn phím đến tất cả trường và nút, thử tên dài C-03.
- **Chấp nhận khi** Các thao tác vẫn tới được và nội dung chính đọc được; cuộn có chủ đích vẫn chấp nhận.

> **Quyết định và lý do** Giữ tiêu chí theo từng kích thước đã thử. S-06 đạt thao tác sau cuộn ở 375 px, phần bị cắt được ghi riêng. D-04, P-04 và C-03 giữ kết quả trong phạm vi viewport đã thử.

### Tab, chỉ báo focus và nhãn trường · S-09, S-10, P-05

- **Vì sao cần kiểm** Các mẫu đo DOM có thể bỏ qua một nút, trường hoặc chỉ báo khó nhìn.
- **Tái hiện** Dùng Tab qua ba màn, ghi thứ tự và trạng thái focus; nhập dữ liệu coupon và đối chiếu nhãn còn nhìn thấy với cây trợ năng.
- **Chấp nhận khi** Thứ tự tương ứng bố cục, focus dễ thấy, trường nhận diện được sau khi nhập. Tách mất mục menu ở S-08.

> **Quyết định và lý do** Giữ S-09 và S-10 Passed trên mẫu điều khiển đã kiểm. Giữ P-05 Failed vì thiếu nhãn liên kết và S-08 Failed vì menu không nhận focus.

### Mức rõ ràng của loading và phản hồi thành công · D-10, P-19

- **Vì sao cần kiểm** Cùng dữ liệu có thể dễ hoặc khó hiểu tùy thời điểm và vị trí đang nhìn.
- **Tái hiện** Giữ request orders thực chờ, xem thẻ trước và sau tải. Tạo mã hợp lệ ở P-19, quan sát khu vực đang thấy ngay sau gửi.
- **Chấp nhận khi** Dashboard phân biệt loading và 0 thật; tạo mã có dấu hiệu rõ như thông báo hoặc hàng mới nhìn thấy được.

> **Quyết định và lý do** Giữ D-10 Failed vì lúc chờ vẫn hiện 0. Giữ P-19 Passed theo dấu hiệu hàng mới xuất hiện trong vùng nhìn ở ca thử.

## 6. Duyệt tiêu chí đã chỉnh (P3)

Các nhóm dưới đây ghi cách áp dụng tiêu chí cho [69 mục](checklist_review.md#quyết-định-theo-id), đối chiếu với bước và kỳ vọng trong [thiết kế kiểm thử](automation/checklist-review.json).

### S-01, D-05

- **Tiêu chí rà soát** Ranh giới thuật ngữ kỹ thuật và nhãn tiếng Anh
- **Tái hiện** Đọc ba màn, phân biệt nhãn Dashboard và hậu tố Delivered của doanh thu.
- **Chấp nhận khi** Có quyết định nhất quán dựa trên FR-21 và ngữ cảnh người dùng, không tính hai lần cùng một chuỗi.

> **Quyết định và lý do** Giữ “Dashboard” như tên màn quen dùng. Áp dụng FR-21 cho nhãn trạng thái “Đã giao”.

### S-02, S-03

- **Tiêu chí rà soát** Ý nghĩa chính xác của màu hành động và h1 mô tả trang
- **Tái hiện** Mở ba màn, đọc màu nút và h1/h2 thực tế.
- **Chấp nhận khi** Đối chiếu màu xanh dương/đỏ; tách số lượng h1 khỏi nội dung mô tả view.

> **Quyết định và lý do** Giữ Failed cho nút Tạo mã màu cam và h1 chung thiếu tên màn.

### S-07, D-06, C-11, P-17

- **Tiêu chí rà soát** Tách active style khỏi đích điều hướng
- **Tái hiện** Bấm lần lượt Dashboard, Danh mục và Mã giảm giá, kiểm nội dung và active style riêng.
- **Chấp nhận khi** Phát hiện style/đích được phân biệt; không yêu cầu URL riêng cho mỗi tab.

> **Quyết định và lý do** Chấp thuận kiểm riêng trạng thái menu đang chọn và nội dung mở đúng. Giữ kết quả của từng ca theo log.

### C-06, C-07, C-16

- **Tiêu chí rà soát** Tách rỗng, khoảng trắng và lỗi kết nối
- **Tái hiện** Gửi từng đầu vào trong sandbox; gửi lại tên hợp lệ khi browser bị ngắt kết nối.
- **Chấp nhận khi** Tên rỗng theo FR-14; xử lý khoảng trắng và cách báo lỗi mạng có căn cứ heuristic.

> **Quyết định và lý do** Giữ ba ca riêng. C-06 kiểm chuỗi rỗng, C-07 kiểm chuỗi toàn dấu cách và C-16 kiểm phản hồi khi thêm gặp lỗi mạng.

### C-12, C-13, C-14, P-19, P-20

- **Tiêu chí rà soát** Tách độ bền, phản hồi và cập nhật tức thời
- **Tái hiện** Tạo dữ liệu thử, quan sát phản hồi tại nút, đọc bảng; chuyển tab và tải lại ở C-12.
- **Chấp nhận khi** Có điểm quan sát riêng cho mỗi mục; thay đổi dễ thấy được tính là phản hồi.

> **Quyết định và lý do** Chấp thuận tiêu chí theo từng thời điểm. Giữ riêng kết quả lưu sau tải lại, cập nhật bảng, phản hồi thành công và đối chiếu dữ liệu đã tạo.

### C-17, C-18, P-22, P-23

- **Tiêu chí rà soát** Xác nhận xóa là heuristic; mục Hủy phụ thuộc UI
- **Tái hiện** Bấm Xóa ở hàng thử, quan sát trước khi xác nhận. Chọn Hủy khi UI cho phép.
- **Chấp nhận khi** Thiếu bước hủy được ghi Blocked cho case phụ thuộc, cùng nguyên nhân với thiếu xác nhận.

> **Quyết định và lý do** Giữ C-17 và P-22 Failed theo tiêu chí an toàn. C-18 và P-23 Blocked vì thiếu bước Hủy.

### P-08, P-21

- **Tiêu chí rà soát** Mã trùng được từ chối, phản hồi nguyên nhân và vị trí là hai oracle
- **Tái hiện** Tạo một mã thử rồi gửi mã đó lần hai; đọc nội dung lỗi và vị trí sau khi đóng hộp thoại nếu có.
- **Chấp nhận khi** Ghi riêng tính duy nhất, mức dễ hiểu của lỗi và FR-22 về vị trí phía trên nút gửi.

> **Quyết định và lý do** Giữ cả hai Failed. P-08 chấm nội dung giải thích lỗi, P-21 chấm vị trí thông báo theo FR-22.

### D-07, D-08, D-09, D-10

- **Tiêu chí rà soát** Độc lập giữa oracle nghiệp vụ, tập rỗng và đang tải
- **Tái hiện** Dùng fixture đơn hỗn hợp, fixture rỗng và giữ request thật đang chờ trong từng lượt.
- **Chấp nhận khi** So số sau tải với tập dữ liệu độc lập; ghi loading như heuristic, không gán lỗi sai số với 0 tạm trong lúc tải.

> **Quyết định và lý do** Giữ bốn ca riêng. D-07 sai doanh thu, D-08 đúng tổng số đơn, D-09 đúng số 0 khi dữ liệu đã tải và D-10 thiếu chỉ báo khi còn chờ.

### P-25, A-04

- **Tiêu chí rà soát** Phân biệt nhận biết trạng thái và xem ngày lịch sử
- **Tái hiện** So coupon hết hạn và còn hạn với ngày trong fixture.
- **Chấp nhận khi** Tiêu chí trạng thái được chấm riêng; giữ ngày lịch sử là đề xuất tùy chọn.

> **Quyết định và lý do** Giữ P-25 kiểm trạng thái hết hạn. Bỏ đề xuất A-04 về ngày lịch sử.

## 7. Duyệt mục bổ sung (P4)

Các mục dưới đây xuất phát từ đề xuất AI và được theo dõi ngoài 69 mục gốc. A-01, A-02, A-05, A-06, A-07 và A-08 đã được chấp thuận làm ca kiểm bổ sung. A-03 đã gộp vào P-20, A-04 đã bỏ. A-08 đã có kết quả Passed do sinh viên báo sau khi thử Windows Narrator.

### A-01 · Không nhận đơn tối thiểu bị xóa trắng

- **Kiểm riêng · Failed** Xóa số 0 mặc định, để trống rồi gửi. POST trả HTTP 200, API đọc lại cho thấy đơn tối thiểu được lưu là chuỗi rỗng. [Ảnh A-01](evidence/recheck/A-01.png).
- **Vì sao cần kiểm** Bản nháp kiểm số âm nhưng bỏ trường hợp người dùng xóa mặc định 0 ở một ô bắt buộc.
- **Tái hiện** Xóa nội dung ô có mặc định 0 rồi gửi qua GUI. Dữ liệu: Mã duy nhất, min_order_amount rỗng.
- **Chấp nhận khi** Không tạo với giá trị tối thiểu trống; hướng dẫn nhập số ≥ 0 hoặc hiển thị rõ mặc định 0 trước khi gửi.

> **Quyết định và lý do** Chấp thuận ca bổ sung vì ô bắt buộc vẫn lưu được chuỗi rỗng.

### A-02 · Số lượt mặc định hiện rõ khi bị xóa

- **Kiểm riêng · Failed** Xóa số 1 mặc định. Ô vẫn trống lúc gửi, POST trả HTTP 200 và hệ thống lưu 1 lần mà không hiện lại giá trị trước khi tạo. [Ảnh A-02](evidence/recheck/A-02.png).
- **Vì sao cần kiểm** Bản nháp dùng số 0, không phát hiện giá trị mặc định được tự điền trong lúc gửi sau khi người dùng xóa.
- **Tái hiện** Xóa số 1 mặc định, thử gửi và ghi giá trị thể hiện ngay trước gửi. Dữ liệu: Mã duy nhất, max_uses_per_user bị xóa trắng.
- **Chấp nhận khi** Giao diện từ chối trường bắt buộc rỗng hoặc hiện lại số hợp lệ rõ ràng trước khi tạo; không lưu một giá trị khác âm thầm.

> **Quyết định và lý do** Chấp thuận ca bổ sung để kiểm khả năng nhìn thấy giá trị mặc định trước khi gửi.

### A-03 · Chấp nhận đúng biên hợp lệ 0 và 1

- **Kiểm riêng · Passed** Tạo được coupon, bảng hiện đúng đơn tối thiểu 0 ₫ và giới hạn 1 lần. Dữ liệu biên đã gộp vào P-20.
- **Vì sao cần kiểm** Bản nháp ưu tiên dữ liệu không hợp lệ, chưa quy định fixture dương đúng sát biên cho cả hai trường.
- **Tái hiện** Gửi coupon ở đúng các biên hợp lệ; chờ hàng mới. Dữ liệu đã thử: Đơn tối thiểu 0 ₫, số lượt 1, giảm cố định 5.000 ₫.
- **Chấp nhận khi** Mã được tạo, bảng hiển thị đơn tối thiểu 0 và lượt 1.

> **Quyết định và lý do** Gộp vào P-20. Ca gộp Passed với đủ sáu ô đúng dữ liệu biên.

### A-04 · Xem lại ngày của mã đã hết hạn

- **Vì sao cần kiểm** Bản nháp P-25 chỉ kiểm phân biệt trạng thái, có thể bỏ sót mất thông tin lịch sử của ngày hết hạn.
- **Tái hiện** Đọc ô Hết hạn và kiểm tra cơ chế xem ngày nếu có. Dữ liệu: Một ngày fixture cụ thể, trạng thái hết hạn.
- **Chấp nhận khi** Người quản trị đọc được ngày hết hạn đã lưu đồng thời nhận biết trạng thái.

> **Quyết định và lý do** Bỏ đề xuất. P-25 đã kiểm nhận biết mã hết hạn.

### A-05 · Không chấp nhận mã toàn khoảng trắng

- **Kiểm riêng · Failed** POST trả HTTP 200, lưu mã gồm ba dấu cách và hiện hàng có ô mã trông như trống. [Ảnh A-05](evidence/recheck/A-05.png).
- **Vì sao cần kiểm** Bản nháp đã phân biệt rỗng/khoảng trắng cho Danh mục nhưng chỉ kiểm mã rỗng ở Coupon.
- **Tái hiện** Nhập khoảng trắng, gửi form và kiểm dữ liệu mới. Dữ liệu: Mã ba ký tự ASCII space.
- **Chấp nhận khi** Không tạo mã chỉ có ký tự khoảng trắng; người dùng thấy yêu cầu sửa mã.

> **Quyết định và lý do** Chấp thuận ca bổ sung. Failed vì coupon lưu được mã toàn dấu cách.

### A-06 · Phản hồi lỗi khi xóa coupon

- **Kiểm riêng · Passed** Giả lập lỗi kết nối riêng trên yêu cầu DELETE của coupon thử. Giao diện báo “Lỗi xóa: Network Error”. Hàng vẫn có trên bảng và trong API đọc lại.
- **Vì sao cần kiểm** Bản nháp kiểm lỗi xóa Danh mục và luồng thành công/hủy của Coupon, không kiểm nhánh thất bại riêng của Coupon.
- **Tái hiện** Tải tab, ngắt mạng, bấm Xóa và xác nhận nếu cần, xem phản hồi. Dữ liệu: Mã do lượt test tạo.
- **Chấp nhận khi** Có lỗi rõ ràng và hàng vẫn còn, không báo thành công.

> **Quyết định và lý do** Chấp thuận ca bổ sung để kiểm phản hồi và dữ liệu khi xóa gặp lỗi mạng.

### A-07 · Mã đã lưu còn sau tải lại trang

- **Kiểm riêng · Passed** Mã và năm thuộc tính hiển thị khớp sau tải lại.
- **Vì sao cần kiểm** Bản nháp kiểm bảng ngay sau lưu nhưng có thể bỏ qua hiện tượng chỉ đổi dữ liệu phía giao diện.
- **Tái hiện** Reload toàn trang, vào lại Mã giảm giá và tìm đúng mã. Dữ liệu: Mã và giá trị được lưu.
- **Chấp nhận khi** Mã và các thuộc tính vẫn khớp sau tải lại.

> **Quyết định và lý do** Chấp thuận ca bổ sung. Passed vì mã và các thuộc tính giữ nguyên sau tải lại.

### A-08 · Tên truy cập nút Xóa phân biệt đối tượng

- **Kiểm một phần** Ba nút ở Danh mục và bốn nút ở Mã giảm giá có cùng tên truy cập “Xóa”. Khi focus nút mẫu, cây trợ năng vẫn báo tên “Xóa”. Tên đối tượng có trong ô cùng hàng. Lượt kiểm tự động chưa đo lời đọc thực tế.
- **Vì sao cần kiểm** Bản nháp đo Tab, focus và xác nhận xóa nhưng chưa xem danh sách nút trùng tên trong cây trợ năng.
- **Tái hiện** Duyệt các nút Xóa bằng cây trợ năng hoặc trình đọc màn hình. Dữ liệu: Hai mã hoặc hai tên danh mục khác nhau.
- **Chấp nhận khi** Người dùng nhận biết sẽ xóa hàng nào qua tên truy cập hoặc ngữ cảnh được đọc cùng nút.

> **Quyết định và lý do** Chấp thuận ca bổ sung. **Kiểm thủ công: Passed** theo kết quả sinh viên báo sau khi thử Windows Narrator. Chưa có bản ghi nguyên văn lời đọc. [Log xác minh](automation/recheck-results.json).

Đối chiếu [điều kiện và cách quan sát](automation/checklist-review.json) của từng đề xuất. [Kết quả kiểm riêng](automation/recheck-results.json) ghi bảy mục đề xuất đã kiểm. A-04 là đề xuất cải tiến tùy chọn và chưa chạy riêng.

## 8. Ca kiểm thủ công bổ sung

### C-22 · Tiếp tục dùng bàn phím sau khi xóa danh mục

- **Thao tác** Tạo Test Focus 1 và Test Focus 2. Dùng Tab tới nút Xóa của Test Focus 1, thực hiện xóa rồi nhấn Tab thêm một lần.
- **Chấp nhận khi** Sau khi xóa hàng thử, lần Tab tiếp theo đưa focus tới điều khiển hợp lý trong bảng, ví dụ nút Xóa của hàng kế tiếp.
- **Quan sát do sinh viên báo** Sau khi xóa Test Focus 1 và nhấn Tab một lần, focus chuyển tới hàng Test Focus 2.
- **Vì sao checklist ban đầu bỏ sót** Checklist đã kiểm thứ tự Tab trong form (S-09) và xóa đúng hàng (C-19). Hai ca đó chưa kiểm điểm focus tiếp theo sau khi hàng bị xóa.

> **Quyết định và lý do** Passed. Sau lần Tab tiếp theo, có thể tiếp tục thao tác trong bảng ở hàng Test Focus 2. Ca được thử theo hướng dẫn. [Kết quả kiểm thủ công](automation/recheck-results.json).
