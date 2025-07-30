import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
}

const ImportContactsService = async (userId: number): Promise<ImportResult> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);
  const wbot = getWbot(defaultWhatsapp.id);

  let phoneContacts;
  const result: ImportResult = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0
  };

  try {
    phoneContacts = await wbot.getContacts();
  } catch (err) {
    logger.error(`Could not get whatsapp contacts from phone. Err: ${err}`);
    throw new Error("Failed to retrieve contacts from WhatsApp");
  }

  if (!phoneContacts || phoneContacts.length === 0) {
    logger.info("No contacts found in WhatsApp");
    return result;
  }

  result.total = phoneContacts.length;
  logger.info(`Starting import of ${result.total} contacts for user ${userId}`);

  // Filter valid contacts
  const validContacts = phoneContacts
    .filter(({ number }) => number && number.trim())
    .map(({ number, name }) => ({
      number: number.trim(),
      name: name && name.trim() ? name.trim() : number.trim()
    }));

  // Get existing contact numbers in batch to avoid multiple database queries
  const existingNumbers = new Set(
    (
      await Contact.findAll({
        attributes: ["number"],
        where: {
          number: validContacts.map(contact => contact.number)
        }
      })
    ).map(contact => contact.number)
  );

  // Filter out existing contacts
  const contactsToCreate = validContacts.filter(
    contact => !existingNumbers.has(contact.number)
  );

  if (contactsToCreate.length === 0) {
    result.skipped = result.total;
    logger.info("All contacts already exist in database");
    return result;
  }

  // Process contacts in smaller batches to avoid overwhelming the database
  const batchSize = 50;
  const batches = [];

  for (let i = 0; i < contactsToCreate.length; i += batchSize) {
    batches.push(contactsToCreate.slice(i, i + batchSize));
  }

  logger.info(
    `Processing ${contactsToCreate.length} new contacts in ${batches.length} batches`
  );

  // Process batches sequentially to avoid overwhelming database
  await batches.reduce(async (previousBatch, batch, batchIndex) => {
    await previousBatch; // Wait for previous batch to complete

    try {
      // Use bulkCreate with ignoreDuplicates to handle any remaining race conditions
      const createdContacts = await Contact.bulkCreate(batch, {
        ignoreDuplicates: true,
        validate: true
      });

      result.imported += createdContacts.length;

      logger.info(
        `Batch ${batchIndex + 1}/${batches.length}: Created ${
          createdContacts.length
        } contacts`
      );

      // Small delay between batches to avoid overwhelming the database
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (err) {
      logger.error(`Error in batch ${batchIndex + 1}: ${err}`);
      result.errors += batch.length;

      // Fallback: try to create contacts individually for this batch
      let successfulIndividual = 0;

      await batch.reduce(async (prevContact, contact) => {
        await prevContact; // Wait for previous contact

        try {
          await Contact.findOrCreate({
            where: { number: contact.number },
            defaults: contact
          });
          successfulIndividual += 1;
        } catch (individualErr) {
          logger.error(
            `Failed to create contact ${contact.number}: ${individualErr}`
          );
        }

        return Promise.resolve();
      }, Promise.resolve());

      result.imported += successfulIndividual;
      result.errors =
        result.errors - batch.length + (batch.length - successfulIndividual);
    }

    return Promise.resolve();
  }, Promise.resolve());

  result.skipped = result.total - result.imported - result.errors;

  logger.info(`Import completed for user ${userId}:`, {
    total: result.total,
    imported: result.imported,
    skipped: result.skipped,
    errors: result.errors
  });

  return result;
};

export default ImportContactsService;
