/**
 * game service
 */
import axios from "axios";
import { factories } from "@strapi/strapi";
import { GOG_API_URL } from "./consts";
import { createGames, createManyToManyData } from "./create";
import QueryString from "qs";

export default factories.createCoreService("api::game.game", ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?${QueryString.stringify(
        params
      )}`;
    const {
      data: { products },
    } = await axios.get(GOG_API_URL);
    await createManyToManyData(products);
    await createGames(products);
  },
}));

