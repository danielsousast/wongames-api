import axios from "axios";
import { gameService } from "./consts";

export async function setImage({ image, game, field = "cover" }) {
    const { data } = await axios.get(image, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");
  
    const FormData = require("form-data");
  
    const formData: any = new FormData();
  
    formData.append("refId", game.id);
    formData.append("ref", `${gameService}`);
    formData.append("field", field);
    formData.append("files", buffer, { filename: `${game.slug}.jpg` });
  
    console.info(`Uploading ${field} image: ${game.slug}.jpg`);
  
    await axios({
      method: "POST",
      url: `http://localhost:1337/api/upload/`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
  }