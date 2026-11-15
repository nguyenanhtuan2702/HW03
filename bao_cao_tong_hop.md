# Báo cáo tổng hợp HW03

GUI Checklist · Moderated Usability Evaluation · Cross-Browser Testing

**Sinh viên** Nguyễn Anh Tuấn · **MSSV** 23120184 · **Ngày tổng hợp** 15/11/2026

## 1. Phạm vi và kết quả chung

Hệ thống kiểm thử là **EShop Web Admin**, với Dashboard (FR-13), Danh mục (FR-14) và Mã giảm giá (FR-17). Hai lượt checklist dùng chung 70 ID. Đánh giá có điều phối tập trung vào một luồng quản lý danh mục, trong đó các phiên thực tế có bước thêm hoặc gán sản phẩm vào danh mục. [Fork EShop](https://github.com/nguyenanhtuan2702/eshop-sut).

| Task | Phạm vi đã thực hiện | Kết quả chính |
|---|---|---|
| 1 · GUI Checklist | 3 màn hình, 70 ca có lượt thử | 43 Passed, 25 Failed, 2 Blocked |
| 2 · Usability | 1 luồng, 7 người tham gia và 1 pilot riêng | 3 hoàn thành, 3 một phần, 1 không hoàn thành. SUS trung bình 48,21/100 |
| 3 · Cross-Browser | 70 ID trên 3 môi trường, 210 lượt theo ca và môi trường | 123 Passed, 81 Failed, 6 Blocked |

## 2. Task 1 · Thiết kế và thực thi GUI Checklist

Checklist ban đầu gồm 69 mục do AI hỗ trợ tạo. Sau khi rà tiêu chí, sinh viên bổ sung ca C-22 để kiểm vị trí focus sau khi xóa một hàng bằng bàn phím. Checklist chính bao phủ IA-01 (tiêu chuẩn GUI), IA-02 (biểu mẫu), IA-03 (điều hướng) và IA-04 (phản hồi và trạng thái). Các đề xuất A-01–A-08 được theo dõi riêng. [Checklist Excel](task1/HW03_Task1_Admin_GUI_Checklist.xlsx) · [Rà soát checklist](task1/checklist_review.md).

Playwright chạy thao tác GUI trên Chrome/Windows với SQLite cách ly. API hỗ trợ chuẩn bị dữ liệu và đối chiếu kết quả. Các lượt kiểm lại cập nhật ghi nhận về zoom 200%, viewport hẹp, dữ liệu sau tải lại và một số ca đề xuất. C-22 đạt theo thao tác bàn phím do sinh viên thực hiện. [Môi trường](task1/environment.md) · [Kết quả và log](task1/test_summary.md).

| Ví dụ | Quan sát |
|---|---|
| D-07 · Doanh thu Dashboard | Số hiển thị không bằng tổng tiền của các đơn đã giao trong dữ liệu thử. |
| C-06/C-07 · Tên danh mục | Hệ thống lưu được tên rỗng hoặc chỉ chứa khoảng trắng. |
| P-11/P-12/P-13 · Giá trị coupon | Hệ thống lưu được giá trị giảm bằng 0, giá trị giảm âm hoặc đơn tối thiểu âm trong các ca tương ứng. |
| C-18/P-23 · Hủy xóa | Blocked vì giao diện không có bước xác nhận để chọn Hủy. |

25 mục Failed được liên kết với issue. Hồ sơ Task 1 ghi **14 issue mới** và **4 issue có sẵn được bổ sung minh chứng**. Một issue có thể bao phủ nhiều ID hoặc ca đề xuất. [Báo cáo Task 1](task1/gui_checklist_report.md) · [Danh sách issue](task1/github_issue_drafts.md).

## 3. Task 2 · Đánh giá tính khả dụng có điều phối

Sinh viên điều phối bảy phiên P01–P07 trong các ngày 10, 13 và 14/11/2026. Ghi chú từng phiên xác nhận đồng ý ghi hình/ghi âm. Người điều phối trình bày mục tiêu, quan sát người tham gia thao tác và hỏi về độ rõ ràng, phục hồi lỗi, tốc độ và mức độ tin tưởng. Pilot P00 ngày 10/11 kiểm tra liên kết và đăng nhập, ghi nhận khó khăn khi đặt lại dữ liệu và dẫn tới việc chỉnh kịch bản. P00 có phản hồi SUS riêng và được loại khỏi thống kê chính thức. [Kế hoạch](task2/usability_artifacts/02_ke_hoach_usability.md) · [Kịch bản](task2/usability_artifacts/03_kich_ban_nhiem_vu.md) · [Ghi chú pilot](task2/usability_artifacts/sessions/P00_pilot.md).

| Phiên | Kết quả nhiệm vụ | SUS / 100 |
|---|---|---:|
| P01 | Không hoàn thành | 5 |
| P02 | Hoàn thành một phần | 37,5 |
| P03 | Hoàn thành | 75 |
| P04 | Hoàn thành một phần | 77,5 |
| P05 | Hoàn thành | 47,5 |
| P06 | Hoàn thành kịch bản rút gọn | 40 |
| P07 | Hoàn thành một phần | 55 |

SUS trung bình **48,21/100**, trung vị **47,50**, độ lệch chuẩn mẫu **24,74**. P06 chỉ cần thêm sản phẩm vào danh mục đã có, vì vậy kết quả phiên này áp dụng cho nhiệm vụ rút gọn. Hồ sơ ghi giờ phiên nhưng chưa có đủ thời lượng thao tác để tính trung bình. [Phân tích SUS](task2/usability_artifacts/04_phan_tich_SUS.md) · [Bảng tính](task2/usability_artifacts/SUS_PhanTich.xlsx).

Các trở ngại ưu tiên cao là nhận biết thứ tự tạo danh mục rồi gán sản phẩm, và thiếu cảnh báo hoặc hướng dẫn phục hồi sau thao tác sai. Các vấn đề ưu tiên trung bình gồm nhận biết trạng thái chỉnh sửa, ràng buộc trường nhập và cách hiển thị giá. Phân loại dựa trên ghi chú hành vi và phỏng vấn. [Báo cáo Task 2](task2/usability_artifacts/05_bao_cao_task2_du_thao.md).

Hai quan sát kỹ thuật được ghi theo mốc video do sinh viên cung cấp. P01, **04:23**, điều khiển “clickall” không phản hồi như mong đợi. P06, **khoảng 05:00**, ghi nhận sai lệch hiển thị sau khi sửa sản phẩm. Hai mục dùng mốc video thay cho ảnh mới, và P06 bổ sung vào issue có sẵn. [Bug report](task2/usability_artifacts/bug_report.md) · [Issue P01 #172](https://github.com/nguyenanhtuan2702/eshop-sut/issues/172) · [Minh chứng P06 trong #44](https://github.com/nguyenanhtuan2702/eshop-sut/issues/44#issuecomment-6889836285).

## 4. Task 3 · Kiểm thử đa trình duyệt

Task 3 dùng lại 70 ID, tiêu chí chấp nhận và dữ liệu thử của Task 1. Chrome và Firefox chạy qua Playwright trên Windows. Safari 18.3/macOS 14.6 chạy qua Selenium trên Sauce Labs Automated, có lượt Safari Live để đối chiếu thủ công. Các cấu hình, phiên bản và ảnh nhận diện được ghi theo từng lượt. [Môi trường và minh chứng](task3/environment_matrix.md).

| Môi trường chính | Có lượt thử | Passed | Failed | Blocked | Not Run |
|---|---:|---:|---:|---:|---:|
| Chrome 157.0.8103.51 / Windows | 70 | 43 | 25 | 2 | 0 |
| Firefox Playwright 153.0 / Windows | 70 | 43 | 25 | 2 | 0 |
| Safari 18.3 / macOS 14.6 | 70 | 37 | 31 | 2 | 0 |
| **Tổng lượt** | **210** | **123** | **81** | **6** | **0** |

25 ID Failed trên cả ba môi trường. Sáu ID đạt trên Chrome và Firefox nhưng Failed trên Safari. Chênh lệch gồm trình tự focus, thao tác tại trường ngày và bố cục **375 × 812 CSS px**. Ở S-06, người thử Safari Live không hoàn tất việc tạo mã vì các ô nhập bị ép hẹp. Các phép thử ở 375 px dùng phương pháp tương tác khác nhau, nên hồ sơ ghi chênh lệch quan sát được và cần kiểm thêm để xác định nguyên nhân riêng của trình duyệt. Ảnh S-06 trên Safari (hồ sơ Moodle) · [Bảng so sánh](task3/test_summary.md).

S-05 ở zoom 200% trên Firefox và Safari được ghi Passed theo xác nhận thủ công của sinh viên. Firefox không có ảnh riêng cho ca này. Ảnh Safari cho thấy Dashboard sau khi phóng to và không hiển thị mức zoom. C-18 và P-23 Blocked trên cả ba môi trường vì thiếu bước xác nhận để thử Hủy. [Ma trận Excel](task3/cross_browser_matrix.xlsx) · [Báo cáo Task 3](task3/cross_browser_report.md) · [Xác minh thủ công](task3/human_verification.md).

## 5. Kết luận và truy vết

Các phát hiện cho thấy cần xác minh dữ liệu Dashboard và kiểm tra ràng buộc nhập liệu, sau đó cải thiện hướng dẫn, phản hồi và cách phục hồi khi thao tác sai. Kết quả đa trình duyệt bổ sung bằng chứng về các thao tác bàn phím và bố cục trên Safari. Đánh giá Task 2 dựa trên bảy người tham gia trong phạm vi nhiệm vụ đã giao, cùng ghi chú và phản hồi SUS của từng phiên.

**Khai báo sử dụng AI.** I use AI tools for the following tasks. OpenAI Codex hỗ trợ thiết kế và rà soát checklist, chuẩn bị môi trường và mã kiểm thử, chuẩn hóa ghi chú, đối chiếu số liệu và biên tập báo cáo. Kết quả phân biệt dữ liệu ghi bởi công cụ với quan sát hoặc xác nhận của sinh viên. [Audit Task 1](ai_audit/task1_audit.md) · [Audit Task 2](task2/usability_artifacts/08_AI_audit_task2.md) · [Audit Task 3](task3/ai_audit.md) · [Critique Task 1](ai_audit/task1_critique.md).

**Hồ sơ nộp.** Link video và danh sách liên hệ đã che số dành cho bộ hồ sơ Moodle. Danh sách liên hệ đầy đủ được giữ riêng. [README và tự chấm](README.md) · [Git commit log tổng hợp](git_commit_log.txt).
