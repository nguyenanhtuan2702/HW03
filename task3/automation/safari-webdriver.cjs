const { EventEmitter } = require('node:events');
const { setTimeout: pause } = require('node:timers/promises');
const { Key } = require('selenium-webdriver');

const roles = {
  alert: '[role="alert"]', button: 'button,input[type="button"],input[type="submit"],[role="button"]',
  cell: 'td,[role="cell"]', columnheader: 'th,[role="columnheader"]', dialog: 'dialog[open],[role="dialog"]',
  heading: 'h1,h2,h3,h4,h5,h6,[role="heading"]', row: 'tr,[role="row"]', table: 'table,[role="table"]',
};

// Resolve the locator subset used by the existing EShop cases in one remote command.
function locate(plan) {
  const normalize = (text) => (text || '').trim().replace(/\s+/g, ' ');
  const matches = (text, match) => !match || (match.regex !== undefined
    ? new RegExp(match.regex, match.flags).test(normalize(text))
    : match.exact ? normalize(text) === normalize(match.text) : normalize(text).toLowerCase().includes(normalize(match.text).toLowerCase()));
  const visible = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility === 'visible';
  function find(steps, root = document) {
    let elements = [root];
    for (const step of steps) {
      if (step.selector) {
        elements = elements.flatMap((el) => step.selector === '..' ? [el.parentElement].filter(Boolean) : [...el.querySelectorAll(step.selector)]);
        if (step.by === 'name') elements = elements.filter((el) => visible(el) && (!step.level || el.tagName === `H${step.level}` || el.getAttribute('aria-level') === String(step.level)) &&
          matches(el.getAttribute('aria-label') ?? (el.tagName === 'INPUT' ? el.value : el.innerText ?? el.textContent), step.match));
        if (step.by === 'placeholder') elements = elements.filter((el) => matches(el.getAttribute('placeholder'), step.match));
        if (step.by === 'text') elements = elements.filter((el) => matches(el.textContent, step.match) && ![...el.children].some((child) => matches(child.textContent, step.match)));
      } else if (step.filter) {
        elements = elements.filter((el) => matches(el.textContent, step.filter.text) && (!step.filter.has || find(step.filter.has, el).length));
      } else if (step.index !== undefined) {
        elements = [elements.at(step.index)].filter(Boolean);
      } else {
        elements = [...new Set([...elements, ...find(step.union, root)])];
      }
    }
    return elements;
  }
  return find(plan);
}

const match = (name, exact = false) => name instanceof RegExp ? { regex: name.source, flags: name.flags } : name === undefined ? null : { text: name, exact };
const timeout = (description) => Object.assign(Error(description), { name: 'TimeoutError' });

class Locator {
  constructor(page, plan = []) { this.page = page; this.plan = plan; }
  add(step) { return new Locator(this.page, [...this.plan, step]); }
  locator(selector) { return this.add({ selector }); }
  getByRole(role, { name, exact, level } = {}) {
    if (!roles[role]) throw Error(`Unsupported EShop role: ${role}`);
    return this.add({ selector: roles[role], by: 'name', match: match(name, exact), level });
  }
  getByText(name, { exact } = {}) { return this.add({ selector: 'body *', by: 'text', match: match(name, exact) }); }
  getByPlaceholder(name, { exact } = {}) { return this.add({ selector: '[placeholder]', by: 'placeholder', match: match(name, exact) }); }
  filter({ hasText, has }) { return this.add({ filter: { text: match(hasText), has: has?.plan } }); }
  first() { return this.nth(0); }
  nth(index) { return this.add({ index }); }
  or(other) { return this.add({ union: other.plan }); }
  async value(fn, arg) {
    return this.page.evaluate(`return (${fn}) ((${locate})(arguments[0]), arguments[1]);`, [this.plan, arg], true);
  }
  count() { return this.value((items) => items.length); }
  async all() { return Array.from({ length: await this.count() }, (_, index) => this.nth(index)); }
  allTextContents() { return this.value((items) => items.map((el) => el.textContent)); }
  evaluateAll(fn, arg) { return this.value(fn, arg); }
  isVisible() { return this.value(([el]) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility === 'visible'); }
  async waitFor({ state = 'visible', timeout: limit = 5500 } = {}) {
    const start = Date.now();
    do {
      const has = ['visible', 'hidden'].includes(state) ? await this.isVisible() : Boolean(await this.count());
      if (has === !['hidden', 'detached'].includes(state)) return;
      await pause(90);
    } while (Date.now() - start < limit);
    throw timeout(`Locator không đạt trạng thái ${state}: ${JSON.stringify(this.plan)}`);
  }
  async element() {
    const start = Date.now();
    do {
      const element = await this.value(([el]) => el || null);
      if (element) return element;
      await pause(90);
    } while (Date.now() - start < 5500);
    throw timeout(`Không tìm thấy phần tử: ${JSON.stringify(this.plan)}`);
  }
  async evaluate(fn, arg) {
    const element = await this.element();
    return this.page.evaluate(`return (${fn})(arguments[0], arguments[1]);`, [element, arg], true);
  }
  textContent() { return this.evaluate((el) => el.textContent); }
  innerText() { return this.evaluate((el) => el.innerText); }
  getAttribute(name) { return this.evaluate((el, key) => el.getAttribute(key), name); }
  inputValue() { return this.evaluate((el) => el.value); }
  isEnabled() { return this.evaluate((el) => !el.disabled); }
  focus() { return this.evaluate((el) => el.focus()); }
  scrollIntoViewIfNeeded() { return this.evaluate((el) => el.scrollIntoView({ block: 'nearest', inline: 'nearest' })); }
  async click() { await this.page.action(async () => (await this.element()).click(), false); }
  async press(name) { await this.page.action(async () => (await this.element()).sendKeys(Key[keyNames[name]]), false); }
  fill(value) {
    return this.evaluate((el, input) => {
      el.focus();
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, input);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }
  selectOption(value) {
    return this.evaluate((el, input) => {
      el.focus();
      if (![...el.options].some((option) => option.value === input)) throw Error('Option not found');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, input);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }
}

const keyNames = { Tab: 'TAB', Enter: 'ENTER', ArrowDown: 'ARROW_DOWN' };

class SafariPage extends EventEmitter {
  constructor(driver, origin) {
    super();
    this.driver = driver;
    this.origin = origin;
    this.routes = new Map();
    this.pending = new Set();
    this.dialogs = [];
    this.dialogAction = 'dismiss';
    this.diagnostics = [];
    this.keyboard = { press: (name) => this.action(() => driver.actions().sendKeys(Key[keyNames[name]]).perform(), false) };
    this.mouse = { move: (x, y) => driver.actions().move({ x, y }).perform() };
  }
  locator(selector) { return new Locator(this).locator(selector); }
  getByRole(...args) { return new Locator(this).getByRole(...args); }
  getByText(...args) { return new Locator(this).getByText(...args); }
  getByPlaceholder(...args) { return new Locator(this).getByPlaceholder(...args); }
  async evaluate(fn, arg, raw = false) {
    const execute = raw ? () => this.driver.executeScript(fn, ...arg) : () => this.driver.executeScript(fn, arg);
    return this.action(execute);
  }
  async action(fn, retry = true) {
    try {
      return await fn();
    } catch (error) {
      if (error.name !== 'UnexpectedAlertOpenError') throw error;
      if (!await this.readAlert(error.getAlertText?.())) throw error;
      if (retry) return fn();
    }
  }
  async readAlert(fallback) {
    try {
      const alert = await this.driver.switchTo().alert();
      const message = await alert.getText();
      // EShop baseline uses window.alert for errors, and no native confirmation for delete.
      this.dialogs.push({ type: 'alert', message, action: this.dialogAction });
      await alert[this.dialogAction]();
      this.dialogAction = 'dismiss';
      return true;
    } catch (error) {
      if (error.name !== 'NoSuchAlertError') throw error;
      if (fallback) this.dialogs.push({ type: 'alert', message: fallback, action: 'browser' });
      return Boolean(fallback);
    }
  }
  async reload() { await this.action(() => this.driver.navigate().refresh()); }
  async measureViewport() {
    const [width, height] = await this.driver.executeScript('return [innerWidth, innerHeight];');
    this.size = { width, height };
  }
  viewportSize() { return this.size; }
  async setViewportSize({ width, height }) {
    if (this.framed) {
      await this.driver.switchTo().defaultContent();
      this.framed = false;
      await this.driver.get(this.origin);
    }
    try {
      for (let index = 0; index < 3; index++) {
        await this.measureViewport();
        if (this.size.width === width && this.size.height === height) return;
        const rect = await this.driver.manage().window().getRect();
        await this.driver.manage().window().setRect({ width: rect.width + width - this.size.width, height: rect.height + height - this.size.height });
      }
    } catch (error) {
      if (!['WebDriverError', 'UnsupportedOperationError', 'InvalidArgumentError'].includes(error.name)) throw error;
    }
    await this.measureViewport();
    if (this.size.width !== width || this.size.height !== height) {
      await this.driver.get(`${this.origin}/__hw03_viewport?width=${width}&height=${height}`);
      const frame = await this.locator('iframe').element();
      await this.driver.switchTo().frame(frame);
      this.framed = true;
      await this.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
      await this.measureViewport();
    }
    if (this.size.width !== width || this.size.height !== height) throw Error(`WebDriver chỉ đạt ${this.size.width}×${this.size.height} CSS px, cần ${width}×${height}.`);
  }
  route(pattern, handler) { this.routes.set(pattern, handler); }
  unroute(pattern) { this.routes.delete(pattern); }
  routeFor(pathname) {
    for (const [pattern, handler] of this.routes) {
      const path = pattern.replace(/^(https?:\/\/[^/]+|\*\*)/, '');
      if (path.endsWith('/**') ? pathname.startsWith(path.slice(0, -2)) : pathname === path) return handler;
    }
  }
  waitForResponse(predicate, options) { return this.waitForEvent('response', predicate, options); }
  waitForEvent(name, predicate, { timeout: limit = 5500 } = {}) {
    const waiting = new Promise((resolve, reject) => {
      const finish = (value, error) => {
        clearTimeout(timer);
        this.off(name, onEvent);
        this.pending.delete(cancel);
        if (error) reject(error);
        else resolve(value);
      };
      const onEvent = (value) => { if (predicate(value)) finish(value); };
      const cancel = () => finish(null, timeout(`Không nhận được sự kiện ${name}.`));
      const timer = setTimeout(cancel, limit);
      this.pending.add(cancel);
      this.on(name, onEvent);
    });
    waiting.catch(() => {});
    return waiting;
  }
  closeCase() {
    for (const cancel of this.pending) cancel();
    this.routes.clear();
    this.removeAllListeners();
  }
}

module.exports = { SafariPage };
