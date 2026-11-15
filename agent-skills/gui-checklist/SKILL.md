---
name: gui-checklist
description: Thiết kế, rà soát và thực thi checklist GUI có thể truy vết tới đặc tả, kết quả và ảnh lỗi. Dùng khi cần kiểm một màn hình hoặc luồng giao diện, tái hiện lỗi, hoặc chạy lại cùng checklist trên trình duyệt khác.
---

# Kiểm thử bằng GUI Checklist

## Chọn phạm vi và tiêu chí

1. Đọc đặc tả, màn hình và checklist hiện có. Ghi phiên bản SUT, màn hình hoặc luồng được giao, trình duyệt, thiết bị, vai trò tài khoản và dữ liệu thử. Nếu người dùng yêu cầu kiểm lại checklist, giữ ID và Expected Result để kết quả có thể so sánh.
2. Khi thiết kế checklist mới, nhóm mục theo IA-01 Tiêu chuẩn GUI, IA-02 Biểu mẫu, IA-03 Điều hướng và IA-04 Phản hồi/trạng thái. Với bộ HW03 Task 1 hoàn chỉnh, tạo hơn 40 mục không trùng và phủ cả bốn nhóm. Với yêu cầu kiểm một màn hình, lấy phạm vi và số ca phù hợp với màn hình đó.
3. Mỗi mục cần một tiêu chí có thể quan sát, kèm ID, nhóm IA, màn hình, căn cứ, tiền điều kiện, dữ liệu, bước và Expected Result. Ghi mã yêu cầu nếu có. Ghi rõ căn cứ heuristic khi xét khả năng sử dụng hoặc truy cập. Với mỗi mục bổ sung sau rà soát, ghi thiếu sót của bản đầu và nguồn bổ sung theo bằng chứng.

## Thực thi và lưu bằng chứng

- Ưu tiên thao tác qua giao diện thực. Dùng API hoặc cơ sở dữ liệu thử để chuẩn bị và đối chiếu, rồi xác minh hành vi người dùng thấy trên màn hình. Với ca thay đổi dữ liệu, tạo mẫu dùng một lần trong môi trường cách ly và hoàn nguyên đúng bản ghi thử sau phiên. Kiểm tra cơ chế seed trước khi khởi động backend có thể tự đặt lại dữ liệu.
- Chọn phương pháp theo tiêu chí. Đo viewport bằng CSS px. Với zoom gốc, kiểm mức zoom từ trình duyệt. Với bàn phím, kiểm điều khiển nhận focus và hiệu ứng của phím thật. Với lỗi mạng hoặc hộp thoại native, giữ lại sự kiện hoặc log giúp xác định điều đã xảy ra. Khi đổi trình duyệt, giữ nguyên oracle và ghi riêng những điều kiện có thể làm kết quả khác nhau.
- Ghi `Passed` khi đã quan sát hành vi phù hợp với Expected Result. Ghi `Failed` khi có sai lệch quan sát được. Dùng `Blocked` khi thiếu tiền điều kiện để hoàn tất ca, gồm cả trường hợp thiếu bước xác nhận để thử Hủy. Dùng `Not Run` khi chưa thực thi. Nếu chỉ có xác nhận của người kiểm thủ công, ghi đúng nguồn xác nhận và giới hạn của ảnh.
- Sau mỗi ca, lưu Actual Result, trạng thái, thời điểm, phiên bản, phương pháp thực thi và tham chiếu minh chứng. Với ca Failed, chụp giao diện thật nếu có thể. Lưu lượt kiểm lại riêng để không ghi đè ảnh hoặc log gốc.

## Tổng hợp

Xuất bảng theo ID, đếm từng trạng thái và đối chiếu tổng số với checklist. Với bug, ghi môi trường, các bước tái hiện, Expected Result, Actual Result, mức ảnh hưởng, ảnh hoặc log. Dò issue theo hành vi và phạm vi trước khi đề xuất issue mới. Các ID cùng lỗi có thể trỏ về một issue. Chỉ đăng hoặc cập nhật GitHub khi người dùng đã yêu cầu thao tác đó.

Ví dụ áp dụng trong hồ sơ HW03: đối chiếu **Task 1 > Hồ sơ môi trường**, **Checklist Excel** và **Tóm tắt kết quả**. Khi dùng trên sản phẩm khác, thay bằng đặc tả, dữ liệu thử và hồ sơ của sản phẩm đó.
