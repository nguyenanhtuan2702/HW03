# HW03 Task 1 · Kiểm thử GUI EShop Web Admin

## Mục tiêu và phạm vi

Đối chiếu giao diện đang chạy với đặc tả và ghi nhận các trở ngại sử dụng có thể tái hiện. Ba màn hình được chọn là Dashboard (FR-13), Danh mục (FR-14) và Mã giảm giá (FR-17), bao phủ IA-01 Tiêu chuẩn GUI, IA-02 Biểu mẫu, IA-03 Điều hướng và IA-04 Phản hồi/trạng thái. Các thao tác dùng chung ở menu được kiểm trong phạm vi ba màn hình. Phạm vi danh mục và mã giảm giá gồm thêm, xem và xóa theo đặc tả.

## Phiên bản và thiết kế

- Bản SUT là mã nguồn fork tại `8f3059fbec0512cc8f04972afe6ca20411a98471`. Lượt kiểm ngày 13/11 dùng workspace có cấu hình Task 2 và khởi chạy chế độ Task 1 trên SQLite cách ly. Môi trường, dữ liệu thử và lệnh chạy lại nằm trong [hồ sơ môi trường](environment.md).
- Giữ [Excel AI gốc](HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx) làm mốc 69 mục. [Bản rà soát sơ bộ](checklist_review.md) và [thiết kế của lượt gốc theo ID](automation/checklist-review.json) giải thích căn cứ, điều kiện, dữ liệu, bước và minh chứng. Tiêu chí thao tác cập nhật của S-06 nằm trong bản rà soát và log kiểm lại. Các điều chỉnh dùng cho lần chạy là đề xuất AI. Tám đề xuất AI nằm riêng và chưa được gắn nguồn Human-added. Log kiểm lại có bảy mục đề xuất đã thử, gồm A-08 có lượt kiểm cây trợ năng và kết quả thủ công do sinh viên báo. A-04 là cải tiến tùy chọn chưa thử.
- Tách yêu cầu SRS khỏi heuristic và đề xuất tùy chọn. Ví dụ, yêu cầu Dashboard tính đúng doanh thu thuộc FR-13, còn chỉ báo tải của Dashboard, trạng thái danh sách rỗng và xác nhận xóa của Web Admin được đánh giá như heuristic. Hai mục hủy xóa phụ thuộc vào việc giao diện cung cấp một bước xác nhận.
- Đánh giá tham chiếu khả năng truy cập ở từng mục riêng. S-04 dùng ngưỡng tương phản cho chữ cỡ nhỏ, S-05 yêu cầu thử phóng to 200%, S-08 kiểm tra điều hướng bằng bàn phím. [W3C Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [W3C Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html).

## Phương pháp chạy và ghi nhận

Playwright điều khiển Chrome đăng nhập và thao tác trên Web Admin thật. Các API chỉ hỗ trợ chuẩn bị dữ liệu và đối chiếu kết quả. SQLite được tạo mới từ bản sao nguyên vẹn của backend, phục hồi dữ liệu thử sau từng mục. Khi thử mạng chậm hoặc mất kết nối, bộ kiểm thử trì hoãn hoặc ngắt các yêu cầu thật của trình duyệt. Mỗi ca có ngữ cảnh trình duyệt mới.

Một ca đạt khi hành vi quan sát được khớp tiêu chí. Ca không đạt phải có sai lệch được xác minh và ảnh thật. Ca không chạy hoặc bị chặn giữ trạng thái riêng. Hai lỗi trong lần chạy thử (tìm dòng và đồng bộ yêu cầu chờ) được xử lý trước lần chạy dùng để báo cáo. Các kết quả từ lượt gián đoạn không được cộng vào thống kê.

## Kết quả và phát hiện

**68/70 mục có kết quả, gồm 43 Passed và 25 Failed.** Tổng này gồm 69 mục gốc và C-22, ca kiểm thủ công bổ sung. Hai mục C-18 và P-23 là Blocked do thiếu bước xác nhận để thử Hủy. S-05 đạt ở zoom gốc 200% của Chromium. S-06 đạt tiêu chí thao tác sau cuộn ở 375 px, với vấn đề bố cục được ghi riêng. Các sai lệch của 69 mục gồm tám nhóm lỗi SRS đã tái hiện và bảy nhóm sai lệch usability. S-03 và D-05 được xếp theo cách áp dụng FR-21 đã ghi trong Human Review.

| Mục | Kỳ vọng | Quan sát |
|---|---|---|
| D-07 · FR-13 | Doanh thu chỉ bằng tổng tiền của đơn đã giao | Một đơn đã giao 246.810 ₫ và một đơn pending 135.790 ₫. Dashboard báo 493.620 ₫. [Ảnh](evidence/D-07.png) |
| C-06 · FR-14 | Không lưu danh mục tên rỗng | Bấm Thêm mới với ô trống tạo dòng #5 không có tên. [Ảnh](evidence/C-06.png) |
| P-11/P-12/P-13 · FR-17 | Giá trị giảm dương và đơn tối thiểu từ 0 | Ba ca độc lập lưu giá trị giảm 0, giá trị giảm −10 và đơn tối thiểu −1. [Ảnh P-11](evidence/P-11.png), [ảnh P-12](evidence/P-12.png), [ảnh P-13](evidence/P-13.png) |

Xem [bảng tóm tắt](test_summary.md), [log gốc](automation/results.json), [log kiểm lại](automation/recheck-results.json), [Excel đã cập nhật](HW03_Task1_Admin_GUI_Checklist.xlsx) và [GitHub Issues đã ghi nhận](github_issue_drafts.md#github-issues-đã-ghi-nhận). Các issue lưu bước tái hiện và ảnh minh chứng. Cột GitHub Issue URL trong Excel liên kết cả 25 mục Failed với issue tương ứng.

## Human Review và giới hạn

- **C-22 · Passed.** Sinh viên thử theo hướng dẫn và báo rằng sau khi xóa Test Focus 1, nhấn Tab một lần đưa focus tới Test Focus 2. Ca này bổ sung phép kiểm điều hướng sau khi xóa hàng. [Chi tiết C-22](human_verification.md#8-ca-kiểm-thủ-công-bổ-sung).

- Tab Human Review đã có nhận xét R-01–R-10 dựa trên rà soát có AI hỗ trợ và các lượt kiểm lại. [Hàng đợi xác minh](human_verification.md) lưu bằng chứng và các quyết định có AI hỗ trợ. A-05 xác nhận coupon lưu được mã toàn dấu cách, A-07 xác nhận dữ liệu còn sau tải lại, A-03 đã gộp vào P-20 và ca gộp Passed với đủ sáu ô khớp. A-01 xác nhận ô đơn tối thiểu trống vẫn lưu được. A-02 xác nhận hệ thống tự lưu 1 lượt khi gửi ô trống. A-06 xác nhận thông báo lỗi xóa và coupon vẫn còn khi yêu cầu mất kết nối. A-04 đã bỏ vì là cải tiến tùy chọn. A-08 được chấp thuận làm ca bổ sung. Sinh viên báo Passed sau khi thử Windows Narrator. Chưa có bản ghi nguyên văn lời đọc.
- Các lượt chạy dùng Chrome hoặc Chromium trên Windows. Kiểm tra S-05 dùng mức zoom gốc 200% do trình duyệt xác nhận. Các nhận định về tính dễ sử dụng, DOM và màu đo giới hạn trong điều khiển, dữ liệu và môi trường đã thử. Hộp thoại native được ghi trong log sự kiện vì ảnh Playwright chỉ chụp vùng trang.
- Excel được kiểm tra sau khi xuất và mở lại bằng công cụ bảng tính cục bộ. Chưa kiểm tra tính lại sau thao tác tương tác trong Microsoft Excel.
- [AI Audit](../ai_audit/task1_audit.md) lưu lịch sử làm việc. [AI Critique](../ai_audit/task1_critique.md) ghi các giới hạn và bài học từ quá trình kiểm thử. Công việc về người tham gia và các nền tảng khác thuộc Task 2 và Task 3.
