import {
  categoryService,
  developerService,
  gameService,
  platformService,
  publisherService,
} from "./consts";
import { create, getByName, getGameInfo } from "./helper";
import { setImage } from "./image";


export async function createManyToManyData(products) {
    const developersSet = new Set();
    const publishersSet = new Set();
    const categoriesSet = new Set();
    const platformsSet = new Set();
  
    products.forEach((product) => {
      const { developers, publishers, genres, operatingSystems } = product;
  
      genres?.forEach(({ name }) => {
        categoriesSet.add(name);
      });
  
      operatingSystems?.forEach((item) => {
        platformsSet.add(item);
      });
  
      developers?.forEach((item) => {
        developersSet.add(item);
      });
  
      publishers?.forEach((item) => {
        publishersSet.add(item);
      });
    });
  
    const createCall = (set, entityName) =>
      Array.from(set).map((name) => create(name, entityName));
  
    return Promise.all([
      ...createCall(developersSet, developerService),
      ...createCall(publishersSet, publisherService),
      ...createCall(categoriesSet, categoryService),
      ...createCall(platformsSet, platformService),
    ]);
  }
  
  

export async function createGames(products) {
  await Promise.all(
    products.map(async (product) => {
      const gameAlreadyExists = await getByName(product.title, gameService);

      if (!gameAlreadyExists) {
        console.info(`Creating: ${product.title}...`);
        const gameDescription = await getGameInfo(product.slug);

        const game = await strapi.service(`${gameService}`).create({
          data: {
            name: product.title,
            slug: product.slug,
            price: product.price.finalMoney.amount,
            release_date: new Date(product.releaseDate),
            categories: await Promise.all(
              product.genres.map(({ name }) => getByName(name, categoryService))
            ),
            platforms: await Promise.all(
              product.operatingSystems.map((name) =>
                getByName(name, platformService)
              )
            ),
            developers: await Promise.all(
              product.developers.map((name) =>
                getByName(name, developerService)
              )
            ),
            publisher: await Promise.all(
              product.publishers.map((name) =>
                getByName(name, publisherService)
              )
            ),
            ...gameDescription,
            publishedAt: new Date(),
          },
        });

        await setImage({ image: product.coverHorizontal, game });
        await Promise.all(
          product.screenshots.slice(0, 5).map((url) =>
            setImage({
              image: `${url.replace(
                "{formatter}",
                "product_card_v2_mobile_slider_639"
              )}`,
              game,
              field: "gallery",
            })
          )
        );

        return game;
      }
    })
  );
}
