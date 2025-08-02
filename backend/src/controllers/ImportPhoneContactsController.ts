import { Request, Response } from "express";
import ImportContactsService from "../services/WbotServices/ImportContactsService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const userId: number = parseInt(req.user.id, 10);

  try {
    const result = await ImportContactsService(userId);

    return res.status(200).json({
      message: "Contacts import completed",
      data: {
        total: result.total,
        imported: result.imported,
        skipped: result.skipped,
        errors: result.errors,
        success: result.errors === 0
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to import contacts",
      error: error.message
    });
  }
};
