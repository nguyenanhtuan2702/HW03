# HW03 Task 1 · Rà soát sơ bộ checklist

**Trạng thái** Rà soát và kiểm lại có AI hỗ trợ. Tab Human Review ghi các quyết định có AI hỗ trợ. Chấp thuận A-01, A-02, A-05, A-06, A-07 và A-08 làm ca bổ sung. A-03 gộp vào P-20, A-04 đã bỏ. [Bản ghi kiểm lại](automation/recheck-results.json) lưu bằng chứng.

## Phạm vi và nguồn đối chiếu

- Dashboard, Danh mục và Mã giảm giá của Web Admin. Đối chiếu FR-13/14/17, FR-21–24 và SEC-04 (tham khảo). Danh mục và mã giảm giá có yêu cầu **thêm, xem, xóa**. Tên gọi CRUD và sự tồn tại của PUT danh mục trong API không tạo ra yêu cầu sửa qua GUI.
- IA-01–04 là nhóm đánh giá trong đề bài HW03. Căn cứ từng mục trỏ tới FR/SEC cụ thể, heuristic, hoặc đề xuất tùy chọn. Mã IA riêng lẻ không làm một kỳ vọng trở thành yêu cầu SRS.
- Đã đọc cả bốn sheet của [bản nháp gốc](HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx). Checklist có 69 mục ban đầu, Summary đếm theo trạng thái, Human Review chưa có kết luận và Instructions mô tả quy trình. Bản nháp được lưu riêng. [Excel tổng hợp](HW03_Task1_Admin_GUI_Checklist.xlsx) phản ánh các lượt kiểm lại.
- Kiểm tra [đặc tả SUT](https://github.com/nguyenanhtuan2702/eshop-sut/blob/8f3059fbec0512cc8f04972afe6ca20411a98471/README.md), [API](https://github.com/nguyenanhtuan2702/eshop-sut/blob/8f3059fbec0512cc8f04972afe6ca20411a98471/api_specification.md), [Web Admin](https://github.com/nguyenanhtuan2702/eshop-sut/blob/8f3059fbec0512cc8f04972afe6ca20411a98471/frontend-admin/src/App.jsx) và [backend](https://github.com/nguyenanhtuan2702/eshop-sut/blob/8f3059fbec0512cc8f04972afe6ca20411a98471/backend/server.js). Dùng mã nguồn để xác định đường thao tác, dữ liệu, rủi ro và cách quan sát. Chỉ kết quả trình duyệt mới xác lập trạng thái thực thi GUI.

## Kết quả rà soát

- Giữ 69 ID gốc để truy xuất lịch sử. Các cặp dễ đếm trùng đã được tách thành mục tiêu khác nhau. S-07 kiểm trạng thái active, D-06/C-11/P-17 kiểm chuyển đúng nội dung. C-12 kiểm qua tải lại, C-14 kiểm cập nhật tức thời. P-08 kiểm duy nhất và lý do từ chối, P-21 kiểm vị trí thông báo. P-19 xét khả năng nhận biết, P-20 đối chiếu dữ liệu.
- D-07 cần đơn đã giao có giá trị dương và đơn trạng thái khác để phát hiện số liệu sai. D-09 chỉ quan sát số 0 sau khi API trả tập rỗng. D-10 quan sát trong khi một yêu cầu thật còn đang tải. Tách lỗi kết nối của S-11 khỏi khôi phục của S-12.
- S-02 khôi phục màu xanh dương/đỏ cụ thể theo FR-21. S-03 kiểm số lượng h1 và mức mô tả nội dung. S-03 đạt phần số lượng nhưng h1 chung chưa mô tả nội dung từng màn. D-05 dùng “Delivered” cho trạng thái nghiệp vụ có bản dịch “Đã giao”. Giữ kết quả Failed của S-03 và D-05 theo cách áp dụng FR-21 đã ghi.
- C-18 và P-23 có điều kiện tiên quyết. Khi UI không có bước xác nhận/hủy, ghi Blocked với lý do, liên kết với C-17/P-22 thay vì tạo phát hiện trùng.
- Không gán yêu cầu SRS cho hộp thoại xác nhận xóa ở Admin, tải lại để giữ tab, phản hồi loading/rỗng riêng của Dashboard, hoặc hiển thị cả ngày hết hạn và badge. Xác nhận xóa, loading và trạng thái rỗng là heuristic có căn cứ. A-04 là cải tiến tùy chọn. Tạo ngày hết hạn trong quá khứ, giới hạn phần trăm tối đa 100, quy tắc trùng tên Danh mục và viết hoa mã không được quy định rõ trong FR-14/17.
- Các phiên lỗi mạng chỉ gián đoạn browser thử nghiệm. Tập dữ liệu rỗng và đơn hàng kiểm thử cần sandbox riêng. Dọn đúng hàng do test tạo, dùng ID từ phản hồi tạo khi tên/mã trống hoặc toàn khoảng trắng.

**Phân bố 69 mục** Shared 12, Dashboard 10, Categories 21, Coupons 26. IA-01 18, IA-03 9, IA-04 23, IA-02 19.
**Phương án thực thi** ASSISTED 12, AUTOMATED 56, MANUAL 1. Phân loại phản ánh cách kiểm tra dự kiến; bản ghi chạy quyết định mục nào đã có đủ bằng chứng.
**Phân loại căn cứ** SRS 30, Heuristic 39. Các mục heuristic có thể cần người xác nhận trước khi ghi lỗi.

## Quyết định theo ID

Mỗi hàng có bước, dữ liệu, điều kiện, cách quan sát và kế hoạch minh chứng trong [thiết kế kiểm thử](automation/checklist-review.json). Excel ghi quyết định đề xuất và lý do cho từng ID. Các kết quả và giới hạn được giải thích trong Human Verification.

| ID | IA | Xử lý | Căn cứ | Cách chấm sơ bộ | Lý do | Sinh viên quyết định  |
|---|---|---|---|---|---|---|
| S-01 | IA-01 | Chỉnh rõ | SRS · FR-21 | Giao diện dùng tiếng Việt nhất quán, ngoại trừ thuật ngữ kỹ thuật chuẩn. | Tách ngôn ngữ dùng chung khỏi nhãn trạng thái doanh thu D-05. | Giữ Passed cho mẫu nhãn đã kiểm. “Dashboard” được chấp nhận làm tên màn. |
| S-02 | IA-01 | Chỉnh rõ | SRS · FR-21 | Nút hành động tích cực màu xanh dương; nút xóa màu đỏ. | Đặc tả quy định màu cụ thể; chỉ kiểm tra “dễ phân biệt” làm yếu yêu cầu. | Dùng yêu cầu màu trong FR-21; giữ Fail nếu màu thực tế không đạt. |
| S-03 | IA-01 | Chỉnh rõ | SRS · FR-21 | Mỗi trang có đúng một h1 mô tả nội dung trang. | Tách số lượng h1 khỏi đánh giá tên h1; generic shell có thể đạt phần số lượng. | Giữ Failed: xét nội dung từng màn. H1 chung chỉ nhận diện ứng dụng. |
| S-04 | IA-01 | Chỉnh rõ | Heuristic · Độ tương phản, ngưỡng 4.5:1 chữ thường, 3:1 chữ lớn | Chữ thường đạt tối thiểu 4.5:1, chữ lớn tối thiểu 3:1. | Có ngưỡng và cặp màu xác định; bản nháp chỉ yêu cầu “đọc rõ”. | Giữ ngưỡng tương phản; xác minh kích cỡ chữ trước khi kết luận. |
| S-05 | IA-01 | Chỉnh rõ | Heuristic · Khả năng sử dụng khi phóng to 200% | Nội dung và thao tác chính vẫn truy cập được; không có chồng lấn khiến thao tác bị che. | Zoom trình duyệt khác thu hẹp viewport; tách S-06. | Passed khi kiểm zoom gốc 200% ngày 13/11/2026. |
| S-06 | IA-01 | Chỉnh rõ | Heuristic · Responsive ở chiều rộng 375 CSS px | Sau khi cuộn khi cần, có thể tiếp cận và hoàn thành thao tác chính trên ba màn ở 375 CSS px. | Chấm theo khả năng thao tác sau cuộn. Phần bố cục bị cắt được ghi riêng. | Passed khi thử thêm, xem và xóa ở 375 px. Ô tên danh mục vẫn bị cắt một phần. |
| S-07 | IA-03 | Chỉnh rõ | SRS · FR-23 | Mục đang chọn được highlight và mục trước hết highlight. | Chỉ chấm trạng thái active của sidebar; đích điều hướng là D-06/C-11/P-17. | Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| S-08 | IA-03 | Giữ | Heuristic · Điều hướng tương tác bằng bàn phím | Có thể tới và mở cả ba màn bằng bàn phím. | Khác S-09 về việc menu có nhận focus và kích hoạt được; dùng phím thích hợp cho widget. | Giữ nguyên. |
| S-09 | IA-03 | Chỉnh rõ | SRS · FR-21 | Các điểm focus khả dụng theo thứ tự đọc trên xuống, trái sang phải. | Đo thứ tự giữa các phần tử nhận focus; việc mất điểm dừng sidebar thuộc S-08. | Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| S-10 | IA-03 | Giữ | Heuristic · Chỉ báo focus nhìn thấy được | Mỗi điều khiển đang focus có chỉ báo rõ nhìn thấy được. | S-09 kiểm thứ tự, S-10 kiểm chỉ báo. | Giữ nguyên.|
| S-11 | IA-04 | Chỉnh rõ | Heuristic · Trạng thái kết nối và phản hồi lỗi | View phân biệt lỗi kết nối với dữ liệu rỗng và thông báo tình trạng hoặc hướng phục hồi. | Chạy lỗi kết nối thật trong browser/session thử nghiệm; tránh dừng backend đang dùng. |Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| S-12 | IA-04 | Chỉnh rõ | Heuristic · Khả năng phục hồi kết nối | Dữ liệu thật xuất hiện và UI sử dụng được, không còn trạng thái lỗi cũ. | Tách trạng thái lỗi S-11 khỏi khả năng tải thành công sau khôi phục. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-01 | IA-01 | Giữ | SRS · FR-13 | Có nhãn nhận diện tổng doanh thu và tổng số đơn hàng. | Kiểm hai chỉ số độc lập với phép tính và hậu tố trạng thái ở D-05. |  Giữ nguyên|
| D-02 | IA-01 | Chỉnh rõ | SRS · FR-21 | Giá trị dùng ký hiệu ₫ và dấu phân tách hàng nghìn theo locale trình duyệt. | Cần số tiền ít nhất bốn chữ số để xác minh phân nhóm, không dùng 0 ₫ làm bằng chứng đầy đủ. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-03 | IA-01 | Giữ | Heuristic · Dễ đọc chỉ số số lượng; FR-13 chỉ bắt buộc tổng số | Giá trị hiển thị dạng số nguyên không kèm đơn vị tiền. | Tách định dạng khỏi độ đúng số lượng ở D-08. |  Giữ nguyên. |
| D-04 | IA-01 | Chỉnh rõ | Heuristic · Bố cục thẻ thống kê | Hai thẻ không đè nhau; nhãn và giá trị đầy đủ. | Cụ thể hóa viewport desktop; zoom thật đã có S-05. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-05 | IA-01 | Chỉnh rõ | SRS · FR-21 | Hậu tố nếu có diễn đạt trạng thái giao thành công dễ hiểu, ưu tiên nhãn “Đã giao”. | Hậu tố Delivered là nhãn trạng thái, cần xét ngoại lệ thuật ngữ; tách khỏi S-01. |  Giữ Failed: “Delivered” là nhãn nghiệp vụ, dùng “Đã giao”. |
| D-06 | IA-03 | Chỉnh rõ | Heuristic · Điều hướng tới đúng nội dung | Nội dung Dashboard và hai thẻ thống kê xuất hiện. | Chỉ kiểm đích từ Danh mục; active style đã kiểm riêng ở S-07. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-07 | IA-04 | Chỉnh rõ | SRS · FR-13 | Doanh thu bằng tổng total_amount của các đơn delivered. | Cần oracle độc lập và dữ liệu có thể phát hiện cộng cả đơn khác hoặc nhân đôi. |  Giữ kiểm số doanh thu; đối chứng độc lập trên tập đơn hỗn hợp. |
| D-08 | IA-04 | Chỉnh rõ | SRS · FR-13 | Tổng số bằng số đơn tồn tại của mọi trạng thái. | So số lượng với tập dữ liệu thực tế thay vì dùng số đã hiển thị làm oracle. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-09 | IA-04 | Chỉnh rõ | Heuristic · Trạng thái rỗng Dashboard; gắn FR-13 | Doanh thu và số đơn bằng 0, không hiển thị NaN hoặc undefined. | Tách rỗng thật sau tải khỏi 0 trong lúc đang tải (D-10). |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| D-10 | IA-04 | Chỉnh rõ | Heuristic · Phân biệt đang tải với dữ liệu thật | Có dấu hiệu đang tải hoặc trạng thái tạm đủ rõ để tránh hiểu nhầm là số 0 đã tải. | IA-04 là nhóm bài tập; SRS không quy định loading riêng cho Dashboard. Có thể dùng độ trễ thực của trình duyệt. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-01 | IA-01 | Giữ | SRS · FR-14 | Có tiêu đề hiển thị rõ nội dung quản lý danh mục. | Nhận diện view sau khi đã mở; C-11 kiểm chuyển view từ sidebar. |  Giữ nguyên. |
| C-02 | IA-01 | Chỉnh rõ | Heuristic · Khả năng đọc và phân biệt các trường; gắn FR-14 | Các cột ID, tên và thao tác có nhãn dễ hiểu tương ứng dữ liệu. | FR-14 không quy định tên cột ID/Hành động; kiểm mỗi nhãn khớp với dữ liệu. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-03 | IA-01 | Chỉnh rõ | Heuristic · Tên dài và khả năng đọc/tiếp cận hàng | Tên có thể xem đầy đủ hoặc đọc qua phương thức rõ ràng; nút Xóa vẫn truy cập được và không bị che. | Cần dữ liệu cụ thể và không suy diễn giới hạn ký tự từ FR-15. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-04 | IA-02 | Chỉnh rõ | Heuristic · Nhãn bền vững và liên kết trường | Ô có nhãn thấy được và tên truy cập có thể nhận diện sau khi nhập. | Placeholder có thể biến mất khi nhập; tách dấu * của C-05. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-05 | IA-02 | Giữ | SRS · FR-22, FR-14 | Có dấu * bên cạnh nhãn trường bắt buộc. | Đặc tả nói rõ dấu * cạnh nhãn. |  Giữ nguyên |
| C-06 | IA-02 | Chỉnh rõ | SRS · FR-14 | Không tạo hàng tên rỗng; giao diện chỉ rõ tên là bắt buộc. | Tách rỗng khỏi khoảng trắng; yêu cầu không thêm là phần chức năng, phản hồi ghi riêng. |  Giữ kiểm tên rỗng theo yêu cầu. |
| C-07 | IA-02 | Chỉnh rõ | Heuristic · Suy luận từ FR-14 về tên có nội dung | Tên không có ký tự nhìn thấy bị từ chối và người dùng biết cần sửa tên. | FR-14 ghi tên không được để trống; xử lý trim là diễn giải, không phải ràng buộc chuẩn hóa độc lập. |  Giữ heuristic tên toàn khoảng trắng, không gán là ràng buộc trim tường minh. |
| C-08 | IA-02 | Chỉnh rõ | Heuristic · Bản địa hóa dữ liệu tiếng Việt | Chữ có dấu và dấu gạch hiển thị đúng nội dung đã nhập. | Dùng mẫu duy nhất để tránh nhầm với dữ liệu gốc. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-09 | IA-02 | Chỉnh rõ | SRS · SEC-04 (tham khảo) | Ký tự <b> và </b> hiển thị như văn bản; không tạo phần tử b từ tên. | Kiểm escape dữ liệu trong GUI với markup vô hại; tránh mã chạy. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-10 | IA-02 | Chỉnh rõ | Heuristic · Gửi form bằng bàn phím | Tạo đúng một danh mục giống thao tác nút Thêm mới. | Một dữ liệu hợp lệ cô lập làm rõ Enter tương đương bấm nút. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-11 | IA-03 | Chỉnh rõ | Heuristic · Điều hướng tới đúng nội dung | Form thêm và bảng Danh mục xuất hiện. | Không lặp kiểm active của S-07 hay h1 của S-03. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-12 | IA-03 | Chỉnh rõ | Heuristic · Tính nhất quán khi điều hướng và tải lại; gắn FR-14 | Cùng tên và ID còn xuất hiện sau chuyển tab và tải lại. | Tách khỏi C-14 bằng việc mở lại và tải lại cả trang. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-13 | IA-04 | Chỉnh rõ | Heuristic · Phản hồi dễ nhận thấy sau gửi | Giao diện phản hồi thành công dễ nhận biết qua cập nhật nhìn thấy được hoặc thông báo có ý nghĩa. | C-14 kiểm dữ liệu; ở đây xem trạng thái form hoặc dấu hiệu thành công. Thông báo riêng là tùy chọn. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-14 | IA-04 | Chỉnh rõ | SRS · FR-14 | Bảng chứa đúng một hàng mới có tên vừa nhập. | Kiểm cập nhật đúng hàng một lần; lưu bền qua reload là C-12. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-15 | IA-04 | Chỉnh rõ | Heuristic · Ngăn gửi trùng ngoài ý muốn | Một ý định tạo dẫn đến tối đa một bản ghi khi bấm lặp trong lúc đang xử lý. | Không giả định tên bắt buộc duy nhất; kiểm hai thao tác trong cùng yêu cầu đang chờ. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-16 | IA-04 | Chỉnh rõ | Heuristic · Khả năng phục hồi lỗi tạo qua GUI | UI báo thao tác thất bại dễ hiểu và có hướng sửa/thử lại; tên chưa được tạo. | Dùng ngắt kết nối thật để tách với rỗng C-06/C-07, đánh giá thông báo và hướng thử lại. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-17 | IA-04 | Giữ | Heuristic · An toàn thao tác phá hủy, không nêu trong FR-14 | Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn tương đương trước khi xóa. | Không ghi lỗi vi phạm SRS khi thiếu xác nhận; chỉ dùng record thử. |  Giữ heuristic an toàn xóa, không diễn giải thành thiếu yêu cầu FR-14. |
| C-18 | IA-04 | Có điều kiện | Heuristic · Hủy từ xác nhận thao tác phá hủy | Danh mục vẫn tồn tại và không gửi lệnh xóa. | Phụ thuộc C-17; thiếu dialog/điểm hủy thì Blocked, tránh đếm lặp cùng thiếu sót. |  Blocked nếu không có hộp thoại/hủy; không tính thành bug thứ hai. |
| C-19 | IA-04 | Chỉnh rõ | SRS · FR-14 | Chỉ hàng mục tiêu biến mất; các hàng khác giữ nguyên. | Kiểm xóa đúng hàng, tách khỏi việc có xác nhận. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-20 | IA-04 | Chỉnh rõ | Heuristic · Phản hồi khi xóa thất bại | UI báo xóa thất bại và hàng còn nguyên, không thể hiện thành công. | Không dùng ID giả vì backend có thể trả thành công; dùng ngắt kết nối thật với hàng thử. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| C-21 | IA-04 | Chỉnh rõ | Heuristic · Trạng thái rỗng có thể nhận diện | Có thông báo không có danh mục, người dùng nhận biết có thể thêm mới. | Không xóa danh mục đang dùng; dùng bộ dữ liệu rỗng riêng có thể hủy. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-01 | IA-01 | Giữ | SRS · FR-17 | Có tiêu đề rõ đây là quản lý mã giảm giá. | Nhận diện view đã mở; P-17 kiểm chuyển từ Dashboard. |  Giữ nguyên. |
| P-02 | IA-01 | Chỉnh rõ | Heuristic · Nhãn bảng dữ liệu FR-17 | Nhãn đầy đủ, dễ phân biệt và đúng thứ tự dữ liệu. | SRS quy định thuộc tính bắt buộc; bảng trình bày chúng với nhãn tương ứng là suy luận GUI. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-03 | IA-01 | Chỉnh rõ | SRS · FR-21, FR-17 | Percent có %, tiền cố định có ₫ và phân nhóm hàng nghìn. | Cần có cả percent và fixed, số tiền đủ lớn để thấy phân nhóm. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-04 | IA-01 | Chỉnh rõ | Heuristic · Bố cục form coupon trên tablet/laptop | Sáu trường và nút không chồng nhau hoặc bị cắt khỏi vùng có thể tiếp cận. | Tách khỏi S-06: dải rộng 768–1280 và tập trung lưới form 6 trường. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-05 | IA-02 | Chỉnh rõ | Heuristic · Nhãn bền vững và tên truy cập | Mỗi trường có nhãn nhận diện được sau khi nhập và tên truy cập phù hợp. | Phân biệt accessible name và placeholder; P-06 kiểm dấu * riêng. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-06 | IA-02 | Chỉnh rõ | SRS · FR-22, FR-17 | Mỗi trường bắt buộc có dấu * cạnh nhãn. | Đặc tả liệt kê sáu trường bắt buộc kể cả trường có mặc định. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-07 | IA-02 | Giữ | SRS · FR-17 | Không tạo mã rỗng; người dùng được hướng dẫn nhập mã. | Cô lập mã rỗng; dùng dữ liệu hợp lệ cho các trường khác. |  Giữ nguyên. |
| P-08 | IA-02 | Chỉnh rõ | SRS · FR-17 (duy nhất); heuristic phản hồi | Mã trùng bị từ chối; phản hồi chỉ rõ mã đã tồn tại. | Tách điều kiện không tạo trùng và nguyên nhân rõ ràng khỏi vị trí phản hồi của P-21. |  Tách tính duy nhất (SRS) khỏi độ rõ ràng thông báo (heuristic). |
| P-09 | IA-02 | Chỉnh rõ | Heuristic · Nhất quán mã giữa form và bảng | Mã xuất hiện sau lưu trùng với dạng đã thấy ngay trước gửi; không biến đổi ngầm giữa hai màn. | Chuẩn hóa chữ hoa là hành vi quan sát được, không là yêu cầu FR-17. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-10 | IA-02 | Giữ | Heuristic · Nhận biết loại và đơn vị; FR-17 giới hạn hai loại | Hai loại phân biệt được và trường giá trị hiển thị đơn vị/hint tương ứng. | Đo phản hồi form khi đổi loại, tách đơn vị bảng P-03. |  Giữ nguyên. |
| P-11 | IA-02 | Giữ | SRS · FR-17 | Không tạo coupon giá trị 0; có hướng dẫn phù hợp. | 0 là biên không hợp lệ, tách với số âm. |  Giữ nguyên. |
| P-12 | IA-02 | Giữ | SRS · FR-17 | Không tạo coupon giá trị âm; có hướng dẫn phù hợp. | Số âm kiểm lớp dữ liệu ngoài miền, khác giá trị biên 0. |  Giữ nguyên. |
| P-13 | IA-02 | Giữ | SRS · FR-17 | Không tạo coupon với đơn tối thiểu dưới 0. | Giá trị -1 nằm sát biên 0; không bỏ qua cập nhật bảng. |  Giữ nguyên. |
| P-14 | IA-02 | Chỉnh rõ | SRS · FR-17 | Không tạo coupon với số lượt dưới 1; giá trị 0 bị báo không hợp lệ. | Chốt test đại diện 0 để tránh kết luận cho số âm chưa thử. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-15 | IA-02 | Giữ | SRS · FR-17 | Không tạo coupon thiếu ngày; thông báo yêu cầu ngày. | Tách thiếu ngày khỏi định dạng và khả năng nhập ngày. |  Giữ nguyên. |
| P-16 | IA-02 | Chỉnh rõ | Heuristic · Khả năng truy cập trường ngày bằng bàn phím | Trường nhận focus, ngày có thể nhập/chọn bằng phím và focus có thể rời trường. | Hành vi native phụ thuộc Chromium/locale; việc đi Tab là kiểm riêng với nhập/chọn. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-17 | IA-03 | Chỉnh rõ | Heuristic · Điều hướng tới đúng nội dung | Form tạo và bảng mã giảm giá xuất hiện. | S-07 kiểm active, P-01 kiểm tiêu đề view đang mở. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-18 | IA-03 | Giữ | SRS · FR-21 | Focus đi qua sáu trường theo trật tự nhìn rồi tới Tạo mã. | Chốt thứ tự từ code tới submit và ghi loại điều khiển. |  Giữ nguyên. |
| P-19 | IA-04 | Chỉnh rõ | Heuristic · Phản hồi thành công dễ nhận biết | Thành công dễ nhận ra qua phản hồi rõ hoặc thay đổi nhìn thấy được; reset im lặng chưa đủ. | P-20 xác minh dữ liệu; P-19 xem người dùng nhận biết trạng thái, có thể thông qua hàng mới trong vùng thấy được. |  Chấp nhận cập nhật rõ nhìn thấy như phản hồi thành công; không bắt buộc toast. |
| P-20 | IA-04 | Chỉnh rõ | SRS · FR-17 | Một hàng mới chứa mã và các trường đúng dữ liệu đã gửi. | So các thuộc tính vừa nhập, tránh chỉ kiểm xuất hiện một tên mã. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-21 | IA-04 | Chỉnh rõ | SRS · FR-22 | Thông báo lỗi hiển thị trong giao diện phía trên nút Tạo mã. | Tách vị trí lỗi khỏi nguyên nhân P-08; lỗi trùng mã là trigger thực tế, không cần giả lập backend. |  Giữ yêu cầu vị trí lỗi theo FR-22; kiểm cả hộp thoại native. |
| P-22 | IA-04 | Giữ | Heuristic · An toàn thao tác phá hủy, không nêu trong FR-17 | Có bước xác nhận rõ đối tượng hoặc cơ hội an toàn trước khi xóa. | Kiểm cơ hội xác nhận hoặc bảo vệ tương đương, chỉ dùng mã thử. |  Giữ heuristic an toàn xóa, không diễn giải thành thiếu yêu cầu FR-17. |
| P-23 | IA-04 | Có điều kiện | Heuristic · Hủy xác nhận xóa | Mã còn và không gửi DELETE. | Phụ thuộc P-22; thiếu dialog/điểm hủy thì Blocked, không nhân đôi lỗi. |  Blocked nếu không có hộp thoại/hủy; không tính thành bug thứ hai. |
| P-24 | IA-04 | Chỉnh rõ | SRS · FR-17 | Chỉ mã mục tiêu biến mất. | Tách xóa thành công khỏi xác nhận hoặc hủy. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |
| P-25 | IA-04 | Chỉnh rõ | Heuristic · Hiển thị trạng thái và ngày hết hạn; tham chiếu FR-17 | Trạng thái hết hạn hoặc ngày hiển thị giúp phân biệt đúng mã hết hạn với mã còn hạn. | Tách việc cho biết hết hạn khỏi đề xuất giữ cả ngày ở A-04; không mặc định SRS bắt buộc badge. |  Chỉ yêu cầu nhận biết hết hạn; việc xem cả ngày là cải tiến riêng. |
| P-26 | IA-04 | Chỉnh rõ | Heuristic · Trạng thái rỗng có thể nhận diện | Có thông báo danh sách rỗng dễ phân biệt với lỗi tải. | Chạy trên sandbox riêng có danh sách rỗng, không xóa mã thật. |  Chỉnh oracle/bước theo cột bên; rà lại kết quả nếu đổi tiêu chí. |

## Mục bổ sung do AI đề xuất

Các mục dưới đây xuất phát từ đề xuất AI. Các ca bổ sung được theo dõi ngoài 69 mục gốc. A-03 được gộp vào P-20, nơi dữ liệu biên đã được kiểm lại qua GUI.

| ID | Màn / IA | Đề xuất | Căn cứ | Vì sao bản nháp bỏ sót | Tiêu chí chấp nhận | Sinh viên quyết định |
|---|---|---|---|---|---|---|
| A-01 | Coupons / IA-02 | Không nhận đơn tối thiểu bị xóa trắng | SRS · FR-17 | Bản nháp kiểm số âm nhưng bỏ trường hợp người dùng xóa mặc định 0 ở một ô bắt buộc. | Không tạo với giá trị tối thiểu trống; hướng dẫn nhập số ≥ 0 hoặc hiển thị rõ mặc định 0 trước khi gửi. |  Kiểm riêng Failed. Form gửi ô trống và hệ thống lưu chuỗi rỗng. Chấp thuận làm ca bổ sung. |
| A-02 | Coupons / IA-02 | Số lượt mặc định hiện rõ khi bị xóa | SRS · FR-17 | Bản nháp dùng số 0, không phát hiện giá trị mặc định được tự điền trong lúc gửi sau khi người dùng xóa. | Giao diện từ chối trường bắt buộc rỗng hoặc hiện lại số hợp lệ rõ ràng trước khi tạo; không lưu một giá trị khác âm thầm. |  Kiểm riêng Failed. Ô vẫn trống lúc gửi nhưng hệ thống tự lưu giới hạn 1 lần. Chấp thuận làm ca bổ sung. |
| A-03 | Coupons / IA-02 | Chấp nhận đúng biên hợp lệ 0 và 1 | SRS · FR-17 | Bản nháp ưu tiên dữ liệu không hợp lệ, chưa quy định fixture dương đúng sát biên cho cả hai trường. | Mã được tạo, bảng hiển thị đơn tối thiểu 0 và lượt 1. |  Gộp vào P-20. Ca gộp Passed với đơn tối thiểu 0 ₫ và giới hạn 1 lần. |
| A-04 | Coupons / IA-01 | Xem lại ngày của mã đã hết hạn | Tùy chọn · Đề xuất hiển thị cả ngày và trạng thái | Bản nháp P-25 chỉ kiểm phân biệt trạng thái, có thể bỏ sót mất thông tin lịch sử của ngày hết hạn. | Người quản trị đọc được ngày hết hạn đã lưu đồng thời nhận biết trạng thái. |  Không thêm; cải tiến tùy chọn, P-25 đã kiểm nhận biết hết hạn. |
| A-05 | Coupons / IA-02 | Không chấp nhận mã toàn khoảng trắng | Heuristic · Suy luận tên mã có ý nghĩa từ FR-17 | Bản nháp đã phân biệt rỗng/khoảng trắng cho Danh mục nhưng chỉ kiểm mã rỗng ở Coupon. | Không tạo mã chỉ có ký tự khoảng trắng; người dùng thấy yêu cầu sửa mã. |  Chấp thuận bổ sung. Failed vì hệ thống lưu mã gồm ba dấu cách. |
| A-06 | Coupons / IA-04 | Phản hồi lỗi khi xóa coupon | Heuristic · Trạng thái thao tác khi mất kết nối | Bản nháp kiểm lỗi xóa Danh mục và luồng thành công/hủy của Coupon, không kiểm nhánh thất bại riêng của Coupon. | Có lỗi rõ ràng và hàng vẫn còn, không báo thành công. |  Kiểm riêng Passed. Giao diện báo lỗi mạng khi xóa và hàng vẫn còn. Chấp thuận làm ca bổ sung. |
| A-07 | Coupons / IA-04 | Mã đã lưu còn sau tải lại trang | Heuristic · Độ bền thao tác tạo; gắn FR-17 | Bản nháp kiểm bảng ngay sau lưu nhưng có thể bỏ qua hiện tượng chỉ đổi dữ liệu phía giao diện. | Mã và các thuộc tính vẫn khớp sau tải lại. |  Chấp thuận bổ sung. Passed vì mã và năm thuộc tính khớp sau tải lại. |
| A-08 | Shared / IA-03 | Tên truy cập nút Xóa phân biệt đối tượng | Heuristic · Tên điều khiển theo ngữ cảnh hàng bảng | Bản nháp đo Tab, focus và xác nhận xóa nhưng chưa xem danh sách nút trùng tên trong cây trợ năng. | Người dùng nhận biết sẽ xóa hàng nào qua tên truy cập hoặc ngữ cảnh được đọc cùng nút. |  Chấp thuận bổ sung. Passed theo kết quả thử Windows Narrator do sinh viên báo. Lượt kiểm cây trợ năng đã ghi tên nút “Xóa” trùng nhau. |

## Căn cứ và phạm vi rà soát

1. Xem lại cách áp dụng FR-21/22 cho trang Admin và xác nhận FR-14/17 chỉ yêu cầu thêm, xem, xóa. Kiểm riêng h1 shell, dấu * và vị trí lỗi form bằng GUI.
2. Đối chiếu bài giảng và chốt mức áp dụng heuristic cho độ tương phản, focus, zoom, thao tác xóa, dữ liệu toàn khoảng trắng và trạng thái lỗi/rỗng. Đối chiếu bằng chứng zoom thật 200% của S-05 và bằng chứng thao tác ở 375 CSS px của S-06.
3. Chạy lại các tình huống Fail theo bằng chứng, kiểm các mục có phán đoán thị giác hoặc ngôn ngữ, rồi lấy mẫu một số mục Passed. Bản ghi thực thi và hàng đợi xác nhận là căn cứ cho bước này.
4. Các quyết định A-01–A-08 nằm trong tab Preliminary Review. A-08 dùng kết quả Narrator do sinh viên báo.

## Bảng đề xuất điền Human Review (R-01–R-10)

| Review ID | Đề xuất | ID ảnh hưởng |
|---|---|---|
| R-01 | Revise | S-02; S-03; P-21 |
| R-02 | Chấp thuận bổ sung. Kiểm thủ công Passed | A-08 |
| R-03 | Revise | D-07; D-09; D-10 |
| R-04 | Revise | C-06; C-07 |
| R-05 | Revise | C-17; C-18; P-22; P-23 |
| R-06 | Gộp dữ liệu biên vào P-20 | P-10; P-20; A-03 |
| R-07 | Remove proposal | A-04 only; keep P-25 |
| R-08 | Revise | S-05; S-06; C-03; P-04 |
| R-09 | Keep scope; clarify | FR-14/FR-17 (scope) |
| R-10 | Chấp thuận bổ sung | A-05; A-07 |

## Ca kiểm thủ công bổ sung

- **C-22 · IA-03 · Passed.** Sau khi xóa Test Focus 1 và nhấn Tab một lần, focus chuyển tới hàng Test Focus 2.
- **Lý do bổ sung** Checklist đã kiểm thứ tự Tab trong form (S-09) và xóa đúng hàng (C-19). Hai ca đó chưa kiểm điểm focus tiếp theo sau khi hàng bị xóa. Sinh viên thực hiện ca được gợi ý và báo kết quả. [Chi tiết C-22](human_verification.md#8-ca-kiểm-thủ-công-bổ-sung).
