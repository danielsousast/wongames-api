import slugify from "slugify";
import { JSDOM } from "jsdom";
import axios from "axios";
import { Exception } from "./exception";

export async function create(name, entityService) {
  try {
    const item = await getByName(name, entityService);

    if (!item) {
      await strapi.service(entityService).create({
        data: {
          name,
          slug: slugify(name, { strict: true, lower: true }),
        },
      });
    }
  } catch (error) {
    console.log("create:", Exception(error));
  }
}

export async function getByName(name, entityService) {
  try {
    const item = await strapi.service(entityService).find({
      filters: { name },
    });

    return item.results.length > 0 ? item.results[0] : null;
  } catch (error) {
    console.log("getByName:", Exception(error));
  }
}

export async function getGameInfo(slug) {
  try {
    const gogSlug = slug.replaceAll("-", "_").toLowerCase();
    const body = await axios.get(`https://www.gog.com/game/${gogSlug}`);
    const { window } = new JSDOM(body.data);
    const descriptionElement = window.document.querySelector(".description");
    const description = descriptionElement.innerHTML;
    const short_description = descriptionElement.textContent.slice(0, 160);
    const ratingElement = window.document.querySelector(
      ".age-restrictions__icon use"
    );
    const rating = parseRatingElement(ratingElement);

    return {
      description,
      short_description,
      rating,
    };
  } catch (error) {
    console.log("getGameInfo:", Exception(error));
  }
}

function parseRatingElement(ratingElement: any | null) {
  if (!ratingElement) return "BR0";
  return ratingElement
    .getAttribute("xlink:href")
    .replace(/_/g, "")
    .replace("#", "");
}
