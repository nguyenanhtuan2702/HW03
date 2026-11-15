# Báo cáo Task 2 — Đánh giá tính khả dụng của EShop Web Admin

## 1. Mục tiêu và phạm vi

Đánh giá khả năng tìm mục Danh mục, hiểu trình tự tạo danh mục và thêm sản phẩm vào đúng danh mục trong EShop Web Admin. Phân tích bốn khía cạnh trong phỏng vấn sau nhiệm vụ: độ rõ ràng, khả năng phục hồi sau lỗi, tốc độ và mức độ tin tưởng.

Kịch bản tham chiếu trong hồ sơ mô tả luồng tạo, kiểm tra rồi xóa danh mục. Ghi chú của các phiên thực tế còn ghi nhận thao tác thêm sản phẩm hoặc nhóm sản phẩm vào danh mục. P06 dùng kịch bản rút gọn vì môi trường bên thứ ba sử dụng bộ dữ liệu riêng khó đặt lại. Người tham gia phiên này chỉ cần thêm sản phẩm vào một danh mục có sẵn. Kết quả dưới đây theo nhiệm vụ đã giao và trạng thái mà người điều phối ghi trong từng phiên. [Kịch bản tham chiếu](03_kich_ban_nhiem_vu.md).

## 2. Phương pháp và dữ liệu

- Thực hiện đánh giá có điều phối với bảy người, mã P01–P07. Các phiên được ghi nhận vào ngày 10, 13 và 14/11/2026. Ghi chú của cả bảy phiên xác nhận người tham gia đồng ý ghi hình/ghi âm.
- Người điều phối đọc tình huống, quan sát và hỏi lý do lựa chọn khi người tham gia đi sai hướng. Các câu hỏi được giải đáp ở mức làm rõ tình huống, giữ quyền chọn thao tác cho người tham gia.
- Nguồn phân tích gồm ghi chú do người điều phối lập khi xem video, câu trả lời phỏng vấn và bảy phản hồi SUS chính thức. Các phần phỏng vấn dưới đây được diễn giải từ ghi chú.
- Pilot P00 được ghi nhận lúc 19:00 ngày 10/11/2026. Lượt này kiểm tra đường dẫn và đăng nhập, ghi nhận khó khăn khi đặt lại dữ liệu và việc chỉnh kịch bản. P00 có một phản hồi SUS riêng và không có bản ghi video. [Hồ sơ P00](sessions/P00_pilot.md).

## 3. Kết quả định lượng

### 3.1. Kết quả theo phiên

| Phiên | Kết quả được ghi | Thao tác nhầm | Mức trợ giúp | SUS / 100 |
|---|---|---|---|---:|
| [P01](sessions/P01.md) | Không hoàn thành | Nhiều | Nhiều | 5 |
| [P02](sessions/P02.md) | Một phần | Ít | Ít | 37,5 |
| [P03](sessions/P03.md) | Hoàn thành | Không | Ít | 75 |
| [P04](sessions/P04.md) | Một phần | Không | Không | 77,5 |
| [P05](sessions/P05.md) | Hoàn thành | Trung bình | Ít | 47,5 |
| [P06](sessions/P06.md) | Hoàn thành kịch bản rút gọn | Không | Không | 40 |
| [P07](sessions/P07.md) | Một phần | Trung bình | Không | 55 |

- **Hoàn thành:** 3/7. P03 và P05 có mức trợ giúp ít. P06 hoàn thành tự lực theo kịch bản rút gọn.
- **Hoàn thành một phần:** 3/7. P02 thêm sản phẩm trước khi tạo danh mục. P04 tạo danh mục nhưng chưa thêm nhóm sản phẩm. P07 tạo được danh mục nhưng chọn sai danh mục khi thêm sản phẩm.
- **Không hoàn thành:** 1/7. P01 gặp khó khăn trong việc hiểu giao diện và cần nhiều trợ giúp.

Các giá trị dạng 19h30 và 20h trong ghi chú được trình bày ở mục giờ ghi nhận của từng phiên. Hồ sơ chưa có đủ thời lượng thao tác đã xác minh để tính trung bình. Do P06 thực hiện nhiệm vụ rút gọn, kết quả của phiên này cần được đọc cùng phần mô tả kịch bản.

### 3.2. Điểm SUS

Điểm trung bình là **48,21/100**, trung vị **47,50/100**, độ lệch chuẩn mẫu **24,74**, khoảng điểm **5–77,5**. P00 được loại khỏi thống kê chính thức. Điểm SUS đo cảm nhận sau phiên, còn kết quả nhiệm vụ được lấy từ ghi chú quan sát. [Phân tích SUS và công thức](04_phan_tich_SUS.md) · [Bảng tính](SUS_PhanTich.xlsx).

## 4. Kết quả định tính

- **Clarity (độ rõ ràng).** P03 và P07 đánh giá giao diện hoặc luồng khá dễ hiểu. P04 hiểu cách làm khi nhìn giao diện nhưng phân vân ở nút **Thêm mới**. P05 nhầm nút này với chức năng tìm kiếm và khó nhận ra trạng thái chỉnh sửa sản phẩm. P01 và P02 cần giải thích rõ hơn về các chức năng hoặc trình tự thao tác. P06 phản ánh một số điều khiển hoạt động khác mong đợi.
- **Error recovery (phục hồi sau lỗi).** P01–P05 và P07 phản ánh họ không biết cách khôi phục, thiếu hướng dẫn hoặc phải làm lại thủ công. P06 biết cách xử lý thủ công nhưng cho rằng việc này khó khi phải xử lý cả danh sách sản phẩm.
- **Speed (tốc độ).** P03, P04, P05 và P07 cho biết thao tác khá nhanh. P01 cho biết chưa hiểu giao diện nên không hoàn thành. P02 nói thiếu hướng dẫn nhưng không đánh giá bước nào dư thừa. Người điều phối quan sát P06 làm khá nhanh, và ghi chú phiên không có câu trả lời trực tiếp của P06 về tốc độ.
- **Trust (mức độ tin tưởng).** Thiếu cảnh báo hoặc phản hồi sau thao tác là mối lo lặp lại, đặc biệt khi thêm, sửa hoặc xóa. P07 không chắc sản phẩm đã được thêm thành công. P03 muốn có ràng buộc rõ hơn với trường bắt buộc khi cập nhật sản phẩm. P06 khá tự tin khi thao tác nhưng vẫn lo về hậu quả khi thiếu cảnh báo.

## 5. Mức độ ưu tiên của các vấn đề usability

Mức độ được đánh giá theo ảnh hưởng quan sát đến nhiệm vụ và khả năng phục hồi. Người tham gia có thể xuất hiện ở nhiều nhóm.

| Mức độ | Phát hiện | Cơ sở đánh giá |
|---|---|---|
| Cao | Luồng tạo danh mục rồi gán sản phẩm chưa đủ rõ | P01 không hoàn thành khi bối rối về chức năng. P02 thêm sản phẩm trước khi tạo danh mục. P04 bỏ dở phần thêm nhóm sản phẩm. P07 chọn sai danh mục. P05 từng nhầm nhưng tự điều chỉnh. |
| Cao | Thiếu cảnh báo, phản hồi và hướng dẫn phục hồi | Nhiều người không biết xử lý sau thao tác sai. P04 phải làm lại thủ công theo lời kể. P06 nhận định việc khắc phục thủ công khó áp dụng khi có nhiều sản phẩm. P07 không chắc thao tác thêm thành công. |
| Trung bình | Phản hồi khi sửa và khả năng đọc giá, nhận biết trường nhập | P03 đề cập ràng buộc trường bắt buộc khi cập nhật. P05 khó nhận ra giao diện đã chuyển sang chỉnh sửa. P07 gặp khó ở trường giá và đề xuất đơn vị, dấu phân cách và ô chọn để nhập nhanh. |

## 6. Hiện tượng kỹ thuật ghi nhận qua video

| Phiên | Mốc video | Hiện tượng được ghi nhận | Theo dõi |
|---|---|---|---|
| P01 | **04:23** | Điều khiển được ghi là “clickall” không phản hồi như mong đợi. | [Issue #172](https://github.com/nguyenanhtuan2702/eshop-sut/issues/172). |
| P06 | **Khoảng 05:00** | Sau thao tác sửa một sản phẩm, người tham gia ghi nhận các mục khác thay đổi theo và giá của một sản phẩm mặc định vẫn hiển thị giá cũ. | [Minh chứng bổ sung trong issue #44](https://github.com/nguyenanhtuan2702/eshop-sut/issues/44#issuecomment-6889836285). |

Các mốc trên do người điều phối cung cấp. Với P06, ghi nhận mô tả hiện tượng trên giao diện. Trạng thái API và dữ liệu lưu của phiên này chưa được đối chiếu. [Bug report Task 2](bug_report.md) · [Chỉ mục video](06_danh_sach_video.md).

## 7. Giới hạn

Mẫu chỉ gồm bảy người. P06 làm kịch bản rút gọn trong môi trường khác, nên mức hoàn thành của phiên này không đủ để suy rộng sang toàn bộ luồng. Điều kiện thiết bị, phiên bản và môi trường của từng phiên chưa được ghi đầy đủ. Bài phân tích dựa trên ghi chú của người điều phối và SUS. Thời lượng thao tác của từng phiên chưa được xác minh.

## 8. Kết luận

Ba người hoàn thành nhiệm vụ được giao, ba người hoàn thành một phần và một người không hoàn thành. Những trở ngại nổi bật là xác định đúng thứ tự tạo và gán danh mục, nhận biết thao tác đã thành công, và biết cách xử lý khi thao tác sai. Điểm SUS trung bình là **48,21/100**. Các ghi chú phiên cho thấy kết quả nhiệm vụ và mức độ tin tưởng thay đổi giữa người tham gia.

## 9. Bằng chứng và hồ sơ nộp

- [Chỉ mục bảy video và xác nhận ghi hình](06_danh_sach_video.md).
- [Phân tích SUS](04_phan_tich_SUS.md) và [AI Audit Task 2](08_AI_audit_task2.md).
- Bảng bảy người tham gia có che bốn số giữa nằm trong phụ lục nộp riêng qua Moodle. [Hướng dẫn chuẩn bị hồ sơ](01_huong_dan.md#danh-sách-liên-hệ-và-quyền-riêng-tư).
