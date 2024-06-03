const express = require("express");
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const puppeteer = require("puppeteer");
const port = process.env.PORT || 3000;
const { URL } = require("url");
const querystring = require("querystring");
const https = require("https");
const partial_path = path.join(__dirname, "./views/partials");
app.use(express.static("./public"));
hbs.registerPartials(partial_path);
app.set("view engine", hbs);

app.set("views", "./views");

app.set("views", path.join(__dirname, "./views"));

const exphbs = require("express-handlebars");
const { url } = require("inspector");
app.set("view engine", "hbs");
const headers = {
  Host: "www.flipkart.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.3",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};
const headers2 = {
  Host: "www.amazon.co.in",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.3",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};

// // Directory path where the executable might be located
const directoryPath = "./chrome/win64-125.0.6422.141/chrome-win64/chrome.exe";
// const directoryPath = "process.env.PUPPETEER_EXECUTABLE_PATH";

// // // Read the contents of the directory
// // fs.readdir(directoryPath, (err, files) => {
// //   if (err) {
// //     console.error('Error reading directory:', err);
// //     return;
// //   }

// //   // Filter files to find the executable
// //   const executableFile = files.find(file => file.endsWith('chrome.exe'));

// //   if (executableFile) {
// //     // If executable file is found, construct the full path
// //     const executablePath = path.join(directoryPath, executableFile);
// //     console.log('Executable Path:', executablePath);
// //   } else {
// //     console.error('Chrome executable not found in directory.');
// //   }
// // });

app.get("/", async (req, res) => {
  const url = `https://www.flipkart.com/search`;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // executablePath: `${directoryPath}`,
      executablePath:
        process.env.Node_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      args: [
        "--ignore-certificate-errors",
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll("div[data-id]");
      const products = [];

      productElements.forEach((element) => {
        var titleElement = element.querySelector(
          "a.WKTcLC, div.WKTcLC , a.wjcEIp"
        );

        // var htmlElement = document.querySelector('a.wjcEIp');
        var title = titleElement ? titleElement.innerText.trim() : "";
        // var title = htmlElement.getAttribute('title');
        // var title = "";
        // if(title1=="")title = title1;
        // else title = title2;
        // var title = document.querySelector(".wjcEIp").getAttribute("title");

        const priceElement = element.querySelector("div.Nx9bqj");
        const price = priceElement ? priceElement.innerText.trim() : "";

        const imageElement = element.querySelector("img[src]");
        const image = imageElement ? imageElement.src : "";

        const ratingElement = element.querySelector('div[class*="XQDdHH"]');
        const rating = ratingElement ? ratingElement.innerText.trim() : "";

        const linkElement = element.querySelector(
          "a.VJA3rP, a.s1Q9rs, a._2UzuFa, div._4rR01T"
        );
        const link = linkElement
          ? "https://www.flipkart.com" + linkElement.getAttribute("href")
          : "";

        products.push({ title, price, image, rating, link });
      });

      return products;
    });

    await browser.close();

    res.render("index.hbs", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const product = [];
// console.log(product);
app.get("/search", async (req, res) => {
  const input = req.query.query;
  // const input = laptop;

  const url = `https://www.flipkart.com/search?q=${input}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      // executablePath: `${directoryPath}`,
      executablePath:
        process.env.Node_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      args: [
        "--ignore-certificate-errors",
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll("div[data-id]");
      const products = [];

      productElements.forEach((element) => {
        const title1 = element.querySelector('div[class*="_4rR01T"]')
          ? element.querySelector('div[class*="_4rR01T"]').innerText
          : null;
        const title2 = element.querySelector(".KzDlHZ")
          ? element.querySelector(".KzDlHZ").innerText
          : null;
        const title3 = element.querySelector(".WKTcLC")
          ? element.querySelector(".WKTcLC").innerText
          : null;

        const productTitle = title1 || title2 || title3;
        const price = element.querySelector('div[class*="Nx9bqj"]')
          ? element.querySelector('div[class*="Nx9bqj"]').innerText
          : null;
        const image = element.querySelector("img[src]")
          ? element.querySelector("img[src]").src
          : null;
        let rating = element.querySelector('div[class*="XQDdHH"]')
          ? element.querySelector('div[class*="XQDdHH"]').innerText
          : "unavailable";
        const halflink = element.querySelector("a.CGtC98")
          ? element.querySelector("a.CGtC98").href
          : null;
        const halflink2 = element.querySelector("a.rPDeLR")
          ? element.querySelector("a.rPDeLR").href
          : null;
        const halflink3 = element.querySelector("a._2UzuFa")
          ? element.querySelector("a._2UzuFa").href
          : null;

        const productLink = halflink || halflink2 || halflink3;
        const link = productLink ? `${productLink}` : "#";
        products.push({ title: productTitle, price, image, rating, link });
      });

      return products;
    });

    await browser.close();
    res.render("index.hbs", { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

app.get("/login", (req, res) => {
  res.render("login.hbs");
});

app.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword.hbs");
});

app.get("/compare", async (req, res) => {
  const input = req.query.title;
  let link = req.query.link;
  // console.log(link);

  if (!input || !link) {
    res.status(400).send('Missing "title" or "link" parameter');
    return;
  }

  // Ensure the link is properly formatted
  if (link.startsWith("https://www.flipkart.comhttps://")) {
    link = link.replace("https://www.flipkart.comhttps://", "https://");
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      // executablePath: `${directoryPath}`,
      executablePath:
        process.env.Node_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      args: [
        "--ignore-certificate-errors",
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
    });

    const amazonPage = await browser.newPage();
    const flipkartPage = await browser.newPage();

    await amazonPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );

    await flipkartPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );

    await amazonPage.setRequestInterception(true);
    amazonPage.on("request", (interceptedRequest) => {
      if (interceptedRequest.url().startsWith("https://")) {
        interceptedRequest.continue({ ignoreHTTPSErrors: true });
      } else {
        interceptedRequest.continue();
      }
    });

    await flipkartPage.setRequestInterception(true);
    flipkartPage.on("request", (interceptedRequest) => {
      if (interceptedRequest.url().startsWith("https://")) {
        interceptedRequest.continue({ ignoreHTTPSErrors: true });
      } else {
        interceptedRequest.continue();
      }
    });

    await amazonPage.goto(`https://www.amazon.in/s?k=${input}`, {
      waitUntil: "load",
      timeout: 0,
    });
    await flipkartPage.goto(link, { waitUntil: "load", timeout: 0 });

    const amazonResponse = await amazonPage.content();
    const flipkartResponse = await flipkartPage.content();

    const $1 = cheerio.load(amazonResponse);
    const $ = cheerio.load(flipkartResponse);

    // Selectors for Flipkart
    const title = $(".VU-ZEz").text().trim();
    // const price = $('div[class*="_30jeq3"]').eq(0).text().trim();
    const price = $(".Nx9bqj.CxhGGd").eq(0).text().trim();
    //  const rating = $('.XQDdHH').eq(0).text().trim();
    const rating = $(".XQDdHH").eq(0).text().trim() + " out of 5 stars";
    const image1 = $("img.DByuf4.IZexXJ.jLEJ7H").attr("src");
    const image2 = $("div.CXW8mj._3nMexc img._396cs4._2amPTt._3qGmMb")
      .attr("srcset")
      ?.split(" ")[0];

    const image = image2 || image1;

    // if (!title || !price || !image) {
    //   console.error('Failed to scrape Flipkart product details.');
    //   res.status(500).send('Failed to scrape Flipkart product details.');
    //   return;
    // }

    const product = [
      {
        title,
        price,
        image,
        rating,
        link,
      },
    ];

    // Selectors for Amazon
    const amazonProducts = [];
    $1(".s-result-item").each((index, element) => {
      const amazonTitle = $1(element).find("h2 span").text().trim();
      const amazonPrice = $1(element)
        .find(".a-price-whole")
        .first()
        .text()
        .trim();
      const amazonRating = $1(element)
        .find(".a-icon-alt")
        .first()
        .text()
        .trim();
      const url = $1(element).find("a.a-link-normal").attr("href");
      const amazonLink = `https://www.amazon.in${url}`;

      if (amazonTitle && amazonPrice && amazonLink) {
        amazonProducts.push({
          amazon_title: amazonTitle,
          amazon_price: amazonPrice,
          amazon_rating: amazonRating,
          amazon_link: amazonLink,
        });
      }
    });

    let a_title = null,
      a_price = null,
      a_rating = null,
      a_link = null;

    for (let i = 0; i < amazonProducts.length; i++) {
      const productx = amazonProducts[i];
      const flipkartTitleFirstWord = product[0].title
        .split(" ")[0]
        .toLowerCase();
      const amazonTitleX = productx.amazon_title.toLowerCase();
      if (amazonTitleX.includes(flipkartTitleFirstWord)) {
        a_title = productx.amazon_title;
        a_price = productx.amazon_price;
        a_link = productx.amazon_link;
        a_rating = productx.amazon_rating;
        break;
      }
    }

    if (!a_title) {
      a_title = product[0].title;
      a_rating = "unavailable";
      a_price = "Currently Unavailable";
      a_link = "";
    }
    if (!a_price) {
      a_price = "Out Of stock";
    }

    await browser.close();

    res.render("compare.hbs", {
      f_title: product[0].title,
      f_image: product[0].image,
      f_rating: product[0].rating,
      f_price: product[0].price,
      f_link: product[0].link,
      a_title: a_title,
      a_price: a_price,
      a_rating: a_rating,
      a_link: a_link,
    });
  } catch (error) {
    console.error("Error during comparison:", error);
    res.status(500).send("An error occurred while comparing the products.");
  }
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
