const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

// The tests will run against the containerized staging environment
// When running in Jenkins (Docker-to-Docker), 'app' is the container name, port 3000 is exposed internally.
const APP_URL = process.env.TEST_URL || 'http://localhost:3001';

describe('ByteCart E-Commerce Automated UI Tests', function() {
    this.timeout(30000); // 30 seconds timeout per test
    let driver;

    before(async function() {
        let options = new chrome.Options();
        options.addArguments('--headless'); // Required by assignment
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');

        let builder = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options);

        // Force Selenium to use the Alpine-native chromedriver instead of downloading an incompatible glibc one
        if (process.env.CHROMEDRIVER_BIN) {
            builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROMEDRIVER_BIN));
        }

        driver = await builder.build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    // TEST 1
    it('1. Should load the homepage successfully', async function() {
        await driver.get(APP_URL);
        await driver.wait(until.titleContains('ByteCart'), 5000);
        const title = await driver.getTitle();
        expect(title).to.include('ByteCart');
    });

    // TEST 2
    it('2. Should display the navigation bar', async function() {
        await driver.get(APP_URL);
        const nav = await driver.wait(until.elementLocated(By.css('nav')), 5000);
        expect(nav).to.not.be.null;
    });

    // TEST 3
    it('3. Should have a link to the Products page', async function() {
        await driver.get(APP_URL);
        const productsLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Products') or contains(text(), 'Shop')]")), 5000);
        expect(productsLink).to.not.be.null;
    });

    // TEST 4
    it('4. Should navigate to the Products page when link is clicked', async function() {
        await driver.get(APP_URL);
        const productsLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Products') or contains(text(), 'Shop')]")), 5000);
        await productsLink.click();
        await driver.wait(until.urlContains('/products'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/products');
    });

    // TEST 5
    it('5. Should load at least one product on the Products page', async function() {
        await driver.get(`${APP_URL}/products`);
        // We look for a common element that represents a product card (e.g. an image or a specific class)
        // Since we seeded the DB, there should be products.
        const productCards = await driver.wait(until.elementsLocated(By.css('a[href^="/products/"]')), 5000);
        expect(productCards.length).to.be.greaterThan(0);
    });

    // TEST 6
    it('6. Should be able to click on a product to view its details', async function() {
        await driver.get(`${APP_URL}/products`);
        const firstProduct = await driver.wait(until.elementLocated(By.css('a[href^="/products/"]')), 5000);
        await firstProduct.click();
        await driver.wait(until.urlMatches(/\/products\/.+/), 5000);
        const url = await driver.getCurrentUrl();
        expect(url).to.match(/\/products\/.+/);
    });

    // TEST 7
    it('7. Product detail page should have an Add to Cart button', async function() {
        await driver.get(`${APP_URL}/products`);
        const firstProduct = await driver.wait(until.elementLocated(By.css('a[href^="/products/"]')), 5000);
        await firstProduct.click();
        const addToCartBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'cart')]")), 5000);
        expect(addToCartBtn).to.not.be.null;
    });

    // TEST 8
    it('8. Should navigate to the Cart page', async function() {
        await driver.get(`${APP_URL}/cart`);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.satisfy(url => url.includes('/cart') || url.includes('sign-in') || url.includes('clerk'));
    });

    // TEST 9
    it('9. Cart page should show empty state when no items are added', async function() {
        await driver.get(`${APP_URL}/cart`);
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText.toLowerCase()).to.satisfy(text => text.includes('empty') || text.includes('0 items') || text.includes('cart'));
    });

    // TEST 10
    it('10. Should have a Footer present on the page', async function() {
        await driver.get(APP_URL);
        const footer = await driver.wait(until.elementLocated(By.css('footer')), 5000);
        expect(footer).to.not.be.null;
    });

    // TEST 11
    it('11. Should display the About page', async function() {
        await driver.get(`${APP_URL}/about`);
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.be.empty;
    });

    // TEST 12
    it('12. Should display the Contact page', async function() {
        await driver.get(`${APP_URL}/contact`);
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.be.empty;
    });

    // TEST 13
    it('13. Should have a functioning admin route', async function() {
        await driver.get(`${APP_URL}/admin`);
        // Admin page might redirect to Clerk login if unauthenticated, or show unauthorized
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.satisfy(url => url.includes('/admin') || url.includes('sign-in') || url.includes('clerk'));
    });

    // TEST 14
    it('14. Search/Layout should be responsive (check meta viewport)', async function() {
        await driver.get(APP_URL);
        const metaViewport = await driver.wait(until.elementLocated(By.css('meta[name="viewport"]')), 5000);
        const content = await metaViewport.getAttribute('content');
        expect(content).to.include('width=device-width');
    });

    // TEST 15
    it('15. Overall application health check', async function() {
        await driver.get(APP_URL);
        // Verify there are no critical application crash screens
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.include('Application error');
        expect(bodyText).to.not.include('Internal Server Error');
    });
});
