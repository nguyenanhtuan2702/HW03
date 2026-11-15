const categoryName = 'Tên danh mục mới';
const categories = 'Danh mục';
const coupons = 'Mã Giảm Giá';

function row(page, name) {
  return page.getByRole('row').filter({ has: page.getByRole('cell', { name, exact: true }) });
}

function requestIs(method, pathname) {
  return (response) => response.request().method() === method && new URL(response.url()).pathname === pathname;
}

async function createCategory(t, name) {
  await t.page.getByPlaceholder(categoryName).fill(name);
  const [response] = await Promise.all([
    t.page.waitForResponse(requestIs('POST', '/api/categories')),
    t.page.getByRole('button', { name: 'Thêm mới', exact: true }).click(),
  ]);
  t.check(response.ok(), `Không tạo được danh mục qua GUI, HTTP ${response.status()}.`);
  await row(t.page, name).waitFor();
  return (await response.json()).id;
}

async function deleteFromTable(t, entry, url, action) {
  const button = entry.getByRole('button', { name: 'Xóa', exact: true });
  const [response] = await Promise.all([
    t.page.waitForResponse(requestIs('DELETE', url)),
    action ? action(button) : button.click(),
  ]);
  t.check(response.ok(), `Xóa qua GUI trả HTTP ${response.status()}.`);
  await entry.waitFor({ state: 'hidden' });
}

module.exports = {
  'C-15': async (t) => {
    await t.open(categories);
    await t.page.getByPlaceholder(categoryName).fill(t.tag);
    const button = t.page.getByRole('button', { name: 'Thêm mới', exact: true });
    const pending = [];
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    const delay = async (route) => {
      if (route.request().method() === 'POST') {
        pending.push(route.request());
        await gate;
      }
      await route.continue();
    };
    await t.page.route('**/api/categories', delay);
    try {
      const response = t.page.waitForResponse(requestIs('POST', '/api/categories'));
      await button.click();
      await t.expect.poll(() => pending.length).toBe(1);
      if (await button.isEnabled()) {
        await button.click();
        await t.expect.poll(() => pending.length).toBe(2);
      }
      const expectedRequests = pending.length;
      t.note(`Giữ POST đầu tới lần bấm thứ hai. Trình duyệt gửi ${expectedRequests} POST trước khi cho request đi tiếp.`);
      release();
      if (!(await response).ok()) t.block('Fixture tạo danh mục trả lỗi HTTP.');
      await t.expect.poll(async () => {
        const list = await (await t.api.get('/api/categories')).json();
        return list.filter((item) => item.name === t.tag).length;
      }).toBe(expectedRequests);
      await t.refresh();
      await t.open(categories);
      await t.expect.poll(() => row(t.page, t.tag).count()).toBe(expectedRequests);
      t.check(expectedRequests === 1, `Hai lần bấm trong lúc chờ tạo ${expectedRequests} hàng cùng tên sau tải lại.`);
      return 'Lượt gửi đang chờ chỉ tạo một hàng, kể cả khi thử gửi lặp.';
    } finally {
      release();
      await t.page.unroute('**/api/categories', delay);
    }
  },

  'S-06': async (t) => {
    await t.page.setViewportSize({ width: 375, height: 812 });
    await t.open('Dashboard');
    await t.open(categories);
    const id = await createCategory(t, t.tag);
    await deleteFromTable(t, row(t.page, t.tag), `/api/categories/${id}`);
    t.note('Thêm, xem và xóa danh mục thử tại 375 CSS px.');
    await t.open(coupons);
    const form = t.page.locator('form').filter({ has: t.page.getByRole('button', { name: 'Tạo mã', exact: true }) });
    const fields = [
      ['input[placeholder^="Mã coupon"]', t.tag],
      ['select', 'fixed'],
      ['input[placeholder^="Số tiền"]', '5000'],
      ['input[placeholder^="Đơn tối thiểu"]', '10000'],
      ['input[type="date"]', '2099-12-31'],
      ['input[placeholder^="Số lần dùng"]', '2'],
    ];
    for (const [selector, value] of fields) {
      const field = form.locator(selector);
      await field.click();
      if (selector === 'select') await field.selectOption(value);
      else await field.fill(value);
    }
    const [created] = await Promise.all([
      t.page.waitForResponse(requestIs('POST', '/api/admin/coupons')),
      form.getByRole('button', { name: 'Tạo mã', exact: true }).click(),
    ]);
    t.check(created.ok(), `Không tạo được coupon tại 375 CSS px, HTTP ${created.status()}.`);
    const entry = row(t.page, t.tag);
    await entry.waitFor();
    await deleteFromTable(t, entry, `/api/admin/coupons/${(await created.json()).id}`);
    t.note('Các trường form có thể nhận thao tác sau cuộn. Đã thêm, xem và xóa coupon thử.');
    return 'Mở được cả ba màn, hoàn thành thêm/xem/xóa danh mục và coupon ở viewport 375 × 812 CSS px.';
  },

  'C-22': async (t) => {
    await t.open(categories);
    const first = `${t.tag}-Focus-1`;
    const second = `${t.tag}-Focus-2`;
    const firstId = await createCategory(t, first);
    await createCategory(t, second);
    const firstRow = row(t.page, first);
    const firstButton = firstRow.getByRole('button', { name: 'Xóa', exact: true });
    await t.page.getByPlaceholder(categoryName).focus();
    const attempts = await t.page.getByRole('button', { name: 'Xóa', exact: true }).count() + 3;
    for (let i = 0; i < attempts; i++) {
      if (await firstButton.evaluate((button) => button === document.activeElement)) break;
      await t.page.keyboard.press('Tab');
    }
    t.check(await firstButton.evaluate((button) => button === document.activeElement), 'Không tới nút Xóa của hàng thử bằng Tab.');
    await deleteFromTable(t, firstRow, `/api/categories/${firstId}`, () => t.page.keyboard.press('Enter'));
    await t.page.keyboard.press('Tab');
    const focused = await t.page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      text: document.activeElement?.textContent?.trim().slice(0, 100),
      row: document.activeElement?.closest('tr')?.textContent?.trim(),
    }));
    t.note(`Sau khi xóa bằng Enter và Tab một lần: ${JSON.stringify(focused)}.`);
    t.check(focused.tag === 'BUTTON' && focused.text === 'Xóa' && focused.row?.includes(second),
      `Sau lần Tab tiếp theo, focus không tới nút Xóa của hàng kế tiếp. Focus thực tế: ${JSON.stringify(focused)}.`);
    return 'Sau khi xóa hàng thử bằng Enter, Tab một lần đưa focus tới nút Xóa của hàng kế tiếp.';
  },
};
