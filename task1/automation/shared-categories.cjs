const navNames = ['Dashboard', 'Danh mục', 'Mã Giảm Giá'];
const nav = (page, name) => page.locator('li').filter({ hasText: new RegExp('^' + name + '$') });
const input = (page) => page.getByPlaceholder('Tên danh mục mới', { exact: true });
const submit = (page) => page.getByRole('button', { name: 'Thêm mới', exact: true });
const table = (page) => page.locator('table');
const row = (page, name) => table(page).getByRole('row').filter({
  has: page.getByRole('cell', { name, exact: true }),
});
const cell = (page, id) => table(page).getByRole('cell', { name: '#' + id, exact: true });
const byId = (page, id) => table(page).getByRole('row').filter({
  has: page.getByRole('cell', { name: '#' + id, exact: true }),
});
const destroy = (line) => line.getByRole('button', { name: 'Xóa', exact: true });
const pathOf = (target) => new URL(target.url()).pathname;
const isResponse = (r, method, pathname) => r.request().method() === method && pathOf(r) === pathname;
const show = (text) => JSON.stringify(text);

async function newCategory(t, name = t.tag, action = 'click') {
  await input(t.page).fill(name);
  t.note(`Nhập tên ${show(name)} rồi gửi form bằng ${action === 'enter' ? 'Enter' : 'nút Thêm mới'}.`);
  const response = await Promise.all([
    t.page.waitForResponse((r) => isResponse(r, 'POST', '/api/categories')),
    action === 'enter' ? input(t.page).press('Enter') : submit(t.page).click(),
  ]).then(([value]) => value);
  if (!response.ok()) t.block('Không tạo được fixture. HTTP ' + response.status());
  const { id } = await response.json();
  await cell(t.page, id).waitFor();
  return id;
}

async function removeCategory(t, id) {
  const path = '/api/categories/' + id;
  t.note(`Nhấn Xóa trên đúng dòng #${id} và theo dõi bảng.`);
  const [response] = await Promise.all([
    t.page.waitForResponse((r) => isResponse(r, 'DELETE', path)),
    destroy(byId(t.page, id)).click(),
  ]);
  if (!response.ok()) t.block('DELETE cho fixture trả HTTP ' + response.status());
  await cell(t.page, id).waitFor({ state: 'detached' });
}

async function rejectedName(t, name) {
  await input(t.page).fill(name);
  t.note(`Nhập ${show(name)} và bấm Thêm mới.`);
  const isValid = await input(t.page).evaluate((el) => el.validity.valid);
  if (!isValid) {
    await submit(t.page).click();
    return 'Trình duyệt chặn giá trị và đưa focus về trường tên.';
  }
  const [response] = await Promise.all([
    t.page.waitForResponse((r) => isResponse(r, 'POST', '/api/categories')),
    submit(t.page).click(),
  ]);
  if (response.ok()) {
    const { id } = await response.json();
    await cell(t.page, id).waitFor();
    t.check(false, `Tên ${show(name)} được lưu. Dòng #${id} xuất hiện với ô tên ${show(await byId(t.page, id).getByRole('cell').nth(1).textContent())}.`);
  }
  t.check(t.dialogs.length > 0 || await t.page.getByRole('alert').count() > 0, 'Tên bị từ chối nhưng GUI không cho biết lý do.');
  return 'Không xuất hiện dòng mới và GUI báo lỗi cho đầu vào.';
}

async function brokenCategoryRequest(t, action) {
  const id = action === 'DELETE' ? await newCategory(t) : null;
  const path = id ? '/api/categories/' + id : '/api/categories';
  const endpoint = '**' + path;
  if (!id) await input(t.page).fill(t.tag);
  const operation = id ? destroy(byId(t.page, id)) : submit(t.page);
  const disconnect = (route) => route.request().method() === action ? route.abort('internetdisconnected') : route.continue();
  await t.page.route(endpoint, disconnect);
  try {
    t.note(`Ngắt riêng kết nối ${action} ${path} ở trình duyệt, thực hiện thao tác GUI và đọc sự kiện hộp thoại.`);
    await Promise.all([
      t.page.waitForEvent('requestfailed', (r) => r.method() === action && pathOf(r) === path),
      operation.click(),
    ]);
    await t.expect.poll(() => t.dialogs.length, { timeout: 2500 }).toBeGreaterThan(0);
    const message = t.dialogs.at(-1).message;
    if (id) {
      t.check(await byId(t.page, id).isVisible(), `Sau lỗi xóa, dòng #${id} biến mất dù yêu cầu không đến máy chủ.`);
      return `GUI hiện hộp thoại “${message}” và giữ dòng #${id}.`;
    }
    t.check(/kết nối|mạng|thử lại/i.test(message), `GUI chỉ hiện “${message}”, không cho biết cách khôi phục. Form vẫn giữ tên đã nhập.`);
    return `Thông báo “${message}” hướng dẫn kiểm tra kết nối hoặc thử lại.`;
  } finally {
    await t.page.unroute(endpoint, disconnect);
  }
}

async function withoutApi(t, body) {
  const pattern = 'http://localhost:3000/api/**';
  const disconnect = (route) => route.abort('internetdisconnected');
  await t.page.route(pattern, disconnect);
  try {
    await Promise.all([
      t.page.waitForEvent('requestfailed', (r) => pathOf(r) === '/api/admin/users'),
      t.page.reload(),
    ]);
    return await body();
  } finally {
    await t.page.unroute(pattern, disconnect);
  }
}

module.exports = {
  'S-01': async (t) => {
    const labels = [];
    for (const name of navNames) {
      await t.open(name);
      const content = await t.page.locator('h2').innerText();
      labels.push(content);
    }
    t.note('Đọc ba tiêu đề và các nút thao tác trong phạm vi. Tách riêng nhãn Delivered (D-05).');
    const buttons = await t.page.getByRole('button').allTextContents();
    t.check(labels.includes('Quản lý Danh mục') && labels.includes('Quản lý Mã Giảm Giá') &&
      buttons.some((name) => name.trim() === 'Tạo mã'), 'Không tìm được nhãn tiếng Việt của màn hình và nút chính.');
    return `Tiêu đề: ${labels.join('; ')}. Nhãn thao tác tiếng Việt; Dashboard được giữ như thuật ngữ quản trị, cần người review xác nhận ngoại lệ.`;
  },
  'S-02': async (t) => {
    await t.open('Danh mục');
    const rgb = (el) => getComputedStyle(el).backgroundColor;
    const category = await submit(t.page).evaluate(rgb);
    const danger = await t.page.getByRole('button', { name: 'Xóa', exact: true }).first().evaluate(rgb);
    await t.open('Mã Giảm Giá');
    const coupon = await t.page.getByRole('button', { name: 'Tạo mã', exact: true }).evaluate(rgb);
    t.note('Đọc màu nền thực tế của Thêm mới, Tạo mã và Xóa từ trình duyệt.');
    const channels = (color) => color.match(/\d+/g).map(Number);
    const [cr, cg, cb] = channels(category);
    const [pr, pg, pb] = channels(coupon);
    const [dr, dg, db] = channels(danger);
    t.check(cb > cr && cb > cg && pb > pr && pb > pg && dr > dg && dr > db,
      `Thêm mới ${category}; Xóa ${danger}; Tạo mã ${coupon} (cam, sai màu xanh dương của FR-21).`);
    return 'Hai nút tạo có màu xanh dương và nút xóa có màu đỏ.';
  },
  'S-03': async (t) => {
    const states = [];
    for (const name of navNames) {
      await t.open(name);
      states.push({ view: name, h1: await t.page.locator('h1').allTextContents(), h2: await t.page.locator('h2').innerText() });
    }
    t.note('Đếm h1 và đối chiếu nội dung h1/h2 với từng màn hình.');
    t.check(states.every(({ view, h1 }) => h1.length === 1 && h1[0].toLowerCase().includes(view.toLowerCase())),
      `Mỗi màn hình có một h1 chung “${states[0].h1[0]}”. Nội dung từng màn chỉ có ở h2 (${states.map((s) => s.h2).join(', ')}).`);
    return 'Mỗi màn hình có một h1 mô tả nội dung đang mở.';
  },
  'S-04': async (t) => {
    await t.open('Danh mục');
    const button = t.page.getByRole('button', { name: 'Xóa', exact: true }).first();
    const colors = await button.evaluate((el) => {
      const style = getComputedStyle(el);
      return [style.color, style.backgroundColor];
    });
    const luminance = (color) => color.match(/\d+/g).slice(0, 3).map((x) => Number(x) / 255)
      .map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
      .reduce((sum, x, i) => sum + x * [0.2126, 0.7152, 0.0722][i], 0);
    const [low, high] = colors.map(luminance).sort((a, b) => a - b);
    const ratio = (high + 0.05) / (low + 0.05);
    t.note('Đo chữ và nền của nút Xóa cỡ nhỏ qua màu trình duyệt, ngưỡng heuristic 4,5:1.');
    t.check(ratio >= 4.5, `Nút Xóa có chữ ${colors[0]} trên nền ${colors[1]}, tỷ lệ ${ratio.toFixed(2)}:1, dưới 4,5:1.`);
    t.block('Nút Xóa đạt ngưỡng, còn cần rà đầy đủ các thành phần khác bằng mắt.');
  },
  'S-06': async (t) => {
    await t.page.setViewportSize({ width: 375, height: 812 });
    t.note('Đặt viewport 375 × 812 và kiểm tra vùng cuộn ngang của khu vực nội dung.');
    const measurements = [];
    for (const name of navNames) {
      await t.open(name);
      const sizes = await t.page.locator('h2').evaluate((el) => {
        const pane = el.parentElement.parentElement;
        return [pane.clientWidth, pane.scrollWidth];
      });
      measurements.push(`${name}: ${sizes.join('/')}`);
    }
    const fullyVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const pane = el.closest('table,form')?.parentElement?.parentElement.getBoundingClientRect();
      return rect.left >= Math.max(0, pane?.left ?? 0) && rect.right <= Math.min(innerWidth, pane?.right ?? innerWidth);
    };
    for (const [name, createButton] of [['Danh mục', 'Thêm mới'], ['Mã Giảm Giá', 'Tạo mã']]) {
      await t.open(name);
      const controls = t.page.locator('form input, form select')
        .or(t.page.getByRole('button', { name: createButton, exact: true }))
        .or(t.page.getByRole('button', { name: 'Xóa', exact: true }).first());
      for (const control of await controls.all()) {
        await control.scrollIntoViewIfNeeded();
        const label = await control.evaluate((el) => el.getAttribute('placeholder') || el.innerText || el.tagName);
        t.check(await control.evaluate(fullyVisible),
          `Ở 375 px, điều khiển “${label}” ở ${name} vẫn bị cắt sau khi cuộn tới; chiều rộng hiển thị/nội dung: ${measurements.join(', ')}.`);
      }
    }
    return `Cuộn tới được các trường, nút tạo và nút Xóa đầu bảng tại 375 px. Chiều rộng hiển thị/nội dung: ${measurements.join(', ')}; chờ xác nhận trải nghiệm cuộn.`;
  },
  'S-07': async (t) => {
    let previous;
    for (const name of navNames) {
      await t.open(name);
      await t.page.mouse.move(500, 60);
      const selected = await nav(t.page, name).evaluate((el) => getComputedStyle(el).color);
      const other = await nav(t.page, previous ?? navNames[1]).evaluate((el) => getComputedStyle(el).color);
      t.check(selected !== other, `Menu ${name} có cùng màu ${selected} với mục không hoạt động.`);
      previous = name;
    }
    t.note('So màu mục hiện tại với một mục không hoạt động, lần lượt qua ba màn.');
    return 'Mục hiện tại khác màu mục không hoạt động trên cả ba màn.';
  },
  'S-08': async (t) => {
    await t.page.evaluate(() => document.activeElement.blur());
    const focused = [];
    for (let i = 0; i < 8; i++) {
      await t.page.keyboard.press('Tab');
      focused.push(await t.page.evaluate(() => {
        const el = document.activeElement;
        return { tag: el.tagName, text: el.textContent?.trim().slice(0, 30) };
      }));
    }
    t.note('Bắt đầu từ đầu Dashboard, bấm Tab tám lần và kiểm tra phần tử nhận focus trước Enter/Space.');
    t.check(focused.some((item) => item.tag !== 'BODY' && navNames.includes(item.text)), 'Tab không focus được bất kỳ mục menu đích nào. Focus thực tế: ' + focused.map((item) => item.tag).join(' → ') + '.');
    t.block('Một mục menu nhận focus nhưng chưa có kiểm tra kích hoạt đầy đủ cả ba mục.');
  },
  'S-09': async (t) => {
    await t.open('Danh mục');
    await input(t.page).focus();
    await t.page.keyboard.press('Tab');
    const first = await submit(t.page).evaluate((el) => el === document.activeElement);
    await t.page.keyboard.press('Tab');
    const second = await t.page.getByRole('button', { name: 'Xóa', exact: true }).first().evaluate((el) => el === document.activeElement);
    t.note('Trong nội dung Danh mục, focus trường Tên rồi bấm Tab hai lần.');
    t.check(first && second, 'Tab không đi theo thứ tự Tên danh mục → Thêm mới → nút Xóa đầu bảng.');
    return 'Trong nội dung Danh mục, Tab đi theo Tên danh mục → Thêm mới → Xóa dòng đầu. Truy cập menu bằng bàn phím được xét riêng ở S-08.';
  },
  'S-10': async (t) => {
    await t.open('Mã Giảm Giá');
    const form = t.page.locator('form');
    await form.locator('input').first().focus();
    t.note('Dùng Tab qua các trường và nút Tạo mã, đọc outline/box-shadow của phần tử có :focus-visible.');
    const focus = [];
    for (let i = 0; i < 7; i++) {
      if (i) await t.page.keyboard.press('Tab');
      focus.push(await t.page.evaluate(() => {
        const el = document.activeElement;
        const css = getComputedStyle(el);
        return { tag: el.tagName, visible: el.matches(':focus-visible') && (css.outlineStyle !== 'none' || css.boxShadow !== 'none') };
      }));
    }
    t.check(focus.every((entry) => entry.visible), 'Có trường hoặc nút không có chỉ báo focus khi điều hướng bằng Tab: ' + show(focus));
    return 'Sáu trường và nút Tạo mã có :focus-visible cùng outline hoặc box-shadow khi nhận focus.';
  },
  'S-11': async (t) => {
    t.note('Mô phỏng mất kết nối của trình duyệt tới API thật rồi tải lại Dashboard.');
    return withoutApi(t, async () => {
      const main = await t.page.locator('h2').evaluate((el) => el.parentElement.innerText);
      t.check(/lỗi|mất kết nối|thử lại/i.test(main), 'GET /api/admin/users thất bại; Dashboard vẫn hiển thị “0 ₫” và “0” mà không có thông báo lỗi.');
      return 'Dashboard hiển thị trạng thái lỗi hoặc hướng phục hồi.';
    });
  },
  'S-12': async (t) => {
    await withoutApi(t, async () => {
      t.note('Quan sát request Admin đầu tiên thất bại trước khi khôi phục kết nối.');
    });
    await t.refresh();
    await t.open('Danh mục');
    const names = await table(t.page).locator('tbody tr td:nth-child(2)').allTextContents();
    t.check(names.includes('Điện thoại') && names.includes('Laptop'), 'Dữ liệu mẫu không xuất hiện lại sau khi bỏ ngắt kết nối và tải lại.');
    return 'Dữ liệu Danh mục mẫu xuất hiện lại sau khôi phục kết nối và tải lại.';
  },
  'C-01': async (t) => {
    await t.open('Danh mục');
    const title = await t.page.locator('h2').innerText();
    t.check(title === 'Quản lý Danh mục', `Tiêu đề thực tế: ${title}.`);
    return 'Tiêu đề “Quản lý Danh mục” xuất hiện.';
  },
  'C-02': async (t) => {
    await t.open('Danh mục');
    const headers = await table(t.page).getByRole('columnheader').allTextContents();
    const hasSeed = await row(t.page, 'Điện thoại').isVisible();
    t.check(headers.join('|') === 'ID|Tên Danh Mục|Hành động' && hasSeed, `Cột thực tế: ${headers.join(', ')}. Có dòng mẫu: ${hasSeed}.`);
    return 'Ba cột ID, Tên Danh Mục, Hành động hiển thị cùng dòng Điện thoại.';
  },
  'C-03': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t, t.tag + ' ' + 'DANHMUCDÀI'.repeat(22));
    const button = destroy(byId(t.page, id));
    await button.scrollIntoViewIfNeeded();
    t.note('Cuộn tới nút Xóa để phân biệt tràn có thể cuộn với điều khiển bị cắt.');
    const position = await button.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), viewport: innerWidth };
    });
    t.check(position.left >= 0 && position.right <= position.viewport, `Tên dài đẩy Xóa ra ngoài viewport 1440 px (nút ở x=${position.left}–${position.right}) kể cả sau khi cuộn tới.`);
    return 'Nút Xóa cùng dòng tên dài hiện đầy đủ sau khi cuộn ở viewport 1440 px. Cần xác nhận khả năng đọc tên theo cách cuộn thực tế.';
  },
  'C-04': async (t) => {
    await t.open('Danh mục');
    const details = await input(t.page).evaluate((el) => ({
      labels: [...el.labels].map((label) => label.textContent.trim()),
      aria: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'),
    }));
    t.note('Kiểm tra nhãn hiển thị, label liên kết và thuộc tính aria của trường tên.');
    t.check(details.labels.length > 0, 'Ô tên chỉ có placeholder “Tên danh mục mới”, không có nhãn hiển thị cố định hoặc label liên kết.');
    return 'Trường tên có label hiển thị và được liên kết.';
  },
  'C-05': async (t) => {
    await t.open('Danh mục');
    const before = await t.page.locator('form').innerText();
    t.note('Đọc phần chữ hiển thị của form thêm danh mục.');
    t.check(before.includes('*'), 'Form thêm danh mục không có nhãn tên kèm dấu *.');
    return 'Nhãn trường bắt buộc có dấu *.';
  },
  'C-06': async (t) => {
    await t.open('Danh mục');
    return rejectedName(t, '');
  },
  'C-07': async (t) => {
    await t.open('Danh mục');
    return rejectedName(t, '   ');
  },
  'C-08': async (t) => {
    await t.open('Danh mục');
    const name = t.tag + ' Đồ dùng học tập – thử nghiệm';
    await newCategory(t, name);
    t.check(await row(t.page, name).isVisible(), 'Dòng mới không giữ đúng nội dung tiếng Việt có dấu.');
    return 'Dòng mới hiển thị đúng chữ tiếng Việt, dấu và ký tự gạch.';
  },
  'C-09': async (t) => {
    await t.open('Danh mục');
    const name = `<b>${t.tag}</b>`;
    const id = await newCategory(t, name);
    const line = byId(t.page, id);
    t.check(await line.locator('b').count() === 0 && (await line.textContent()).includes(name),
      'Chuỗi thử không hiển thị nguyên văn hoặc sinh ra markup trong bảng.');
    return 'Chuỗi <b>…</b> xuất hiện nguyên văn, không tạo phần tử HTML b.';
  },
  'C-10': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t, t.tag, 'enter');
    t.check(await row(t.page, t.tag).isVisible(), 'Enter không hiển thị dòng có tên đã nhập.');
    return `Enter gửi form và dòng #${id} xuất hiện.`;
  },
  'C-11': async (t) => {
    await t.open('Danh mục');
    t.check(await table(t.page).isVisible() && await input(t.page).isVisible(), 'Điều hướng không mở bảng và form Danh mục.');
    return 'Từ Dashboard, mục Danh mục mở đúng form và bảng.';
  },
  'C-12': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t);
    await t.open('Dashboard');
    await t.open('Danh mục');
    const afterNav = await cell(t.page, id).isVisible();
    await t.refresh();
    await t.open('Danh mục');
    t.check(afterNav && await cell(t.page, id).isVisible(), 'Dòng vừa tạo bị mất khi chuyển màn hoặc tải lại.');
    return `Dòng #${id} vẫn xuất hiện khi quay lại và sau reload.`;
  },
  'C-13': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t);
    t.check(await row(t.page, t.tag).isVisible() && await input(t.page).inputValue() === '',
      'Tạo thành công nhưng tên còn trong form hoặc dòng mới không xuất hiện.');
    return `Dòng #${id} xuất hiện ngay và trường tên được dọn trống.`;
  },
  'C-14': async (t) => {
    await t.open('Danh mục');
    await newCategory(t);
    const total = await row(t.page, t.tag).count();
    t.check(total === 1, `Một lần gửi form tạo ${total} dòng có cùng tên thử.`);
    return 'Một lần gửi form tạo đúng một dòng có tên duy nhất.';
  },
  'C-15': async (t) => {
    await t.open('Danh mục');
    await input(t.page).fill(t.tag);
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    let requests = 0;
    const delay = async (route) => {
      if (route.request().method() === 'POST') {
        requests++;
        await gate;
      }
      await route.continue();
    };
    await t.page.route('**/api/categories', delay);
    try {
      t.note('Giữ POST đầu ở Playwright, bấm Thêm mới lần nữa khi form còn chờ, rồi cho các yêu cầu thật đi tiếp.');
      const firstPost = t.page.waitForEvent('request', (r) => r.method() === 'POST' && pathOf(r) === '/api/categories');
      await submit(t.page).click();
      await firstPost;
      const duplicate = await submit(t.page).isEnabled();
      if (duplicate) {
        const secondPost = t.page.waitForEvent('request', (r) => r.method() === 'POST' && pathOf(r) === '/api/categories');
        await submit(t.page).click();
        await secondPost.catch(() => {});
      }
      const finished = t.expect.poll(async () => {
        const response = await t.api.get('/api/categories');
        return (await response.json()).filter((entry) => entry.name === t.tag).length;
      }, { timeout: 4000 }).toBe(requests);
      release();
      await finished;
      const response = await t.api.get('/api/categories');
      const copies = (await response.json()).filter((entry) => entry.name === t.tag).length;
      if (copies > 1) {
        await t.refresh();
        await t.open('Danh mục');
      }
      t.check(copies === 1, `Hai lần bấm trong lúc chờ tạo ${copies} dòng cùng tên. Ghi nhận ${requests} yêu cầu POST.`);
      return 'Khi thao tác đang chờ, gửi lặp vẫn chỉ tạo một dòng.';
    } finally {
      release();
      await t.page.unroute('**/api/categories', delay);
    }
  },
  'C-16': async (t) => {
    await t.open('Danh mục');
    return brokenCategoryRequest(t, 'POST');
  },
  'C-17': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t);
    const line = byId(t.page, id);
    await line.scrollIntoViewIfNeeded();
    await t.capture();
    let deletes = 0;
    t.page.on('request', (r) => {
      if (r.method() === 'DELETE' && pathOf(r) === '/api/categories/' + id) deletes++;
    });
    t.note('Bấm Xóa một lần, chờ bảng phản ánh thao tác và theo dõi yêu cầu DELETE/hộp thoại.');
    await destroy(line).click();
    if (deletes === 0 && (t.dialogs.some((d) => d.type === 'confirm') || await t.page.getByRole('dialog').count())) {
      return 'GUI hỏi xác nhận trước khi gửi DELETE.';
    }
    await cell(t.page, id).waitFor({ state: 'detached' });
    await t.capture();
    t.check(false, `Một lần bấm Xóa gửi DELETE và làm mất dòng #${id} ngay. Không có hộp thoại xác nhận.`);
  },
  'C-18': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t);
    await destroy(byId(t.page, id)).click();
    t.note('Tìm hộp thoại xác nhận để chọn Hủy sau khi bấm Xóa.');
    if (!t.dialogs.some((d) => d.type === 'confirm') && !await t.page.getByRole('dialog').count()) {
      t.block('Không có bước xác nhận để chọn Hủy. Xem C-17.');
    }
    t.check(await byId(t.page, id).isVisible(), 'Dòng biến mất sau khi bỏ xác nhận.');
    return 'Bỏ xác nhận giữ nguyên danh mục thử.';
  },
  'C-19': async (t) => {
    await t.open('Danh mục');
    const id = await newCategory(t);
    const before = await table(t.page).locator('tbody tr td:first-child').allTextContents();
    await removeCategory(t, id);
    const after = await table(t.page).locator('tbody tr td:first-child').allTextContents();
    t.check(show(after) === show(before.filter((value) => value !== '#' + id)), 'Danh sách sau xóa khác ngoài dòng được chọn.');
    return `Chỉ dòng #${id} biến mất, các dòng còn lại giữ nguyên.`;
  },
  'C-20': async (t) => {
    await t.open('Danh mục');
    return brokenCategoryRequest(t, 'DELETE');
  },
  'C-21': async (t) => {
    return t.emptyList('categories', async () => {
      t.note('Làm rỗng danh mục trong DB dùng riêng, tải lại thật rồi mở Danh mục.');
      await t.refresh();
      await t.open('Danh mục');
      const rows = await table(t.page).locator('tbody tr').count();
      const message = await t.page.getByText(/chưa có danh mục|không có danh mục/i).count();
      t.check(rows === 0 && message > 0, `Danh mục rỗng có ${rows} dòng và ${message} thông báo trạng thái rỗng. GUI chỉ hiện form và đầu bảng.`);
      return 'Danh sách trống hiển thị thông báo.';
    });
  },
};
