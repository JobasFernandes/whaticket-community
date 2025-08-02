import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";

const CheckContactNumber = async (number: string): Promise<string> => {
  const defaultWhatsapp = await GetDefaultWhatsApp();

  const wbot = getWbot(defaultWhatsapp.id);

  const validNumber = await wbot.getNumberId(`${number}@c.us`);

  if (!validNumber) {
    throw new Error("Invalid contact number");
  }

  return validNumber.user;
};

export default CheckContactNumber;
