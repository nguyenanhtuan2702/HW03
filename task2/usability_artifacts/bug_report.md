# Bug report — HW03 Task 2 · EShop Web Admin

Nguồn minh chứng là video của phiên usability. Các đoạn cần xem được người điều phối xác định theo mã phiên và mốc video. [Chỉ mục video](06_danh_sach_video.md).

## T2-01 · Điều khiển “clickall” không phản hồi

- **Phiên và mốc video.** [P01](sessions/P01.md), **04:23**.
- **Quan sát.** Người tham gia bấm điều khiển được ghi chú là “clickall” và không nhận được phản hồi như mong đợi.
- **Kỳ vọng.** Khi người dùng bấm điều khiển, giao diện thực hiện chức năng tương ứng hoặc cho biết vì sao thao tác chưa thể thực hiện.
- **Đối chiếu.** Tua tới 04:23 để xác định nhãn chính xác, màn hình và trạng thái của điều khiển, rồi thử lại thao tác trên dữ liệu thử nghiệm.
- **GitHub.** [Issue #172](https://github.com/nguyenanhtuan2702/eshop-sut/issues/172).

## T2-02 · Giao diện sản phẩm hiển thị dữ liệu chưa đúng sau khi sửa

- **Phiên và mốc video.** [P06](sessions/P06.md), **khoảng 05:00**.
- **Quan sát.** Người tham gia ghi nhận các mục khác thay đổi theo sau khi sửa một sản phẩm. Khi cập nhật giá của một sản phẩm mặc định, giá hiển thị vẫn giữ nguyên theo ghi chú phiên.
- **Kỳ vọng.** Sau khi lưu thành công, giao diện hiển thị giá mới của sản phẩm vừa sửa. Thông tin của những sản phẩm khác giữ nguyên.
- **Đối chiếu.** Kiểm tra các dòng trên bảng trước và sau khi lưu, rồi tải lại trang để phân biệt trạng thái hiển thị với dữ liệu đã lưu. Phiên usability ghi nhận hiện tượng trên giao diện.
- **GitHub.** Issue #44 đã theo dõi hiện tượng hiển thị sai sau khi sửa sản phẩm. [Bình luận bổ sung mốc P06](https://github.com/nguyenanhtuan2702/eshop-sut/issues/44#issuecomment-6889836285).
