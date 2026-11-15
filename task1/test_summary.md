# HW03 Task 1 · Tóm tắt kết quả kiểm thử

Phạm vi gồm **3 màn hình** Web Admin và các kiểm tra dùng chung. Checklist có **69 mục gốc** và **1 ca kiểm thủ công bổ sung (C-22)**. Bảng dùng [lần chạy gốc ngày 09/11/2026](automation/results.json) và cập nhật S-05, S-06, P-20 theo [các lượt kiểm riêng ngày 13/11/2026](automation/recheck-results.json). Lượt chạy lại với bộ kiểm gốc tái hiện trạng thái của cả 69 mục. C-22 lấy kết quả thử bàn phím do sinh viên báo trong chat.

| Tổng mục | Có lần thử GUI | Đã xác định Pass/Fail | Passed | Failed | Not Run | Blocked |
|---:|---:|---:|---:|---:|---:|---:|
| 70 | 70 | 68 | 43 | 25 | 0 | 2 |

**Tỷ lệ có kết quả** 68/70 = 97,1%. **Tỷ lệ đạt trong các mục đã xác định kết quả** 43/68 = 63,2%. Cả 25 mục Failed có ảnh trình duyệt và bản ghi thao tác. Tám mục xuất phát từ đề xuất AI được theo dõi ngoài tổng số 69. A-01, A-02, A-05, A-06, A-07 và A-08 được chấp thuận làm ca bổ sung với AI hỗ trợ. A-03 gộp vào P-20, A-04 đã bỏ. A-08 đạt theo kết quả kiểm thủ công do sinh viên báo.

## Theo khía cạnh giao diện

| Nhóm | Tổng | Passed | Failed | Not Run | Blocked |
|---|---:|---:|---:|---:|---:|
| IA-01 · Tiêu chuẩn GUI | 18 | 14 | 4 | 0 | 0 |
| IA-02 · Biểu mẫu | 19 | 9 | 10 | 0 | 0 |
| IA-03 · Điều hướng | 10 | 9 | 1 | 0 | 0 |
| IA-04 · Phản hồi và trạng thái | 23 | 11 | 10 | 0 | 2 |

## Theo màn hình

| Màn hình | Tổng | Passed | Failed | Not Run | Blocked |
|---|---:|---:|---:|---:|---:|
| Dùng chung | 12 | 7 | 5 | 0 | 0 |
| Dashboard | 10 | 7 | 3 | 0 | 0 |
| Danh mục | 22 | 13 | 8 | 0 | 1 |
| Mã giảm giá | 26 | 16 | 9 | 0 | 1 |

## Theo cách thực thi

| Cách thực thi | Tổng | Passed | Failed | Not Run | Blocked |
|---|---:|---:|---:|---:|---:|
| AUTOMATED | 56 | 33 | 21 | 0 | 2 |
| ASSISTED | 12 | 8 | 4 | 0 | 0 |
| MANUAL | 2 | 2 | 0 | 0 | 0 |

70 mục đã có lượt thử trên GUI, gồm C-22 do sinh viên thực hiện theo hướng dẫn. Hai mục Blocked (C-18 và P-23) thiếu bước xác nhận xóa để thao tác Hủy. S-05 thuộc nhóm thiết kế MANUAL và được kiểm bằng zoom gốc 200% của Chromium qua công cụ điều khiển trình duyệt. S-06 đạt tiêu chí thao tác ở 375 px sau cuộn. Ảnh cũ vẫn ghi nhận vấn đề bố cục.

## Phát hiện và bước xác minh

- **8 nhóm lỗi SRS đã tái hiện**, gồm S-03 và D-05 theo cách áp dụng FR-21 đã ghi trong Human Review. Bảy nhóm khác là sai lệch usability theo heuristic. Bố cục ở 375 px được giữ làm quan sát bổ sung. [Danh sách và bản nháp lỗi](github_issue_drafts.md).
- Kiểm riêng các đề xuất: A-03, A-06 và A-07 Passed. A-01, A-02 và A-05 Failed theo tiêu chí đề xuất. A-08 Passed theo kết quả thử Windows Narrator do sinh viên báo. A-04 chưa chạy riêng. [Bằng chứng kiểm lại](automation/recheck-results.json).
- Kết quả Assisted thể hiện phần quan sát bằng trình duyệt đã ghi. [Human Verification](human_verification.md) ghi quyết định đề xuất, căn cứ và giới hạn của các mẫu đã kiểm.
- Đã đăng 14 issue mới và bổ sung minh chứng vào 4 issue hiện có trên fork. Excel có URL GitHub cho cả 25 mục Failed trong bộ 69 mục gốc. [Danh sách issue](github_issue_drafts.md#github-issues-đã-ghi-nhận). [Excel kết quả](HW03_Task1_Admin_GUI_Checklist.xlsx).
