/**
 * game controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::game.game",
  ({ strapi }) => ({
    async populate(context) {
      const options = {
        limit: 48,
        order: "desc:trending",
        ...context.query
      }
      await strapi.service("api::game.game").populate(context.query);
      context.send("Populated!");
    },
  })
);
