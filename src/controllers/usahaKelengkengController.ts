import { Request, Response } from "express";
import usahaKlengkengService from "../services/usahaKlengkengService";

const addUsahaKlengkeng = async (req: Request, res: Response) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const newUsahaKlengkeng = await usahaKlengkengService.addUsahaKlengkeng(
      data
    );
    res.status(201).json({
      statusCode: 201,
      message: "UsahaKlengkeng created successfully",
      data: newUsahaKlengkeng,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateUsahaKlengkeng = async (req: Request, res: Response) => {
  try {
    const updatedUsahaKlengkeng =
      await usahaKlengkengService.updateUsahaKlengkeng(
        req.params.kode,
        req.body
      );
    if (!updatedUsahaKlengkeng) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaKlengkeng tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaKlengkeng updated successfully",
      data: updatedUsahaKlengkeng,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteUsahaKlengkeng = async (req: Request, res: Response) => {
  try {
    const deletedUsahaKlengkeng =
      await usahaKlengkengService.deleteUsahaKlengkeng(req.params.kode);
    if (!deletedUsahaKlengkeng) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaKlengkeng tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaKlengkeng deleted successfully",
      data: deletedUsahaKlengkeng,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getUsahaKlengkengByKode = async (req: Request, res: Response) => {
  try {
    const usahaKlengkeng = await usahaKlengkengService.getUsahaKlengkengByKode(
      req.params.kode
    );
    if (!usahaKlengkeng) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaKlengkeng tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaKlengkeng fetched successfully",
      data: usahaKlengkeng,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllUsahaKlengkeng = async (req: Request, res: Response) => {
  try {
    const usahaKlengkengList =
      await usahaKlengkengService.getAllUsahaKlengkeng();
    res.status(200).json({
      statusCode: 200,
      message: "UsahaKlengkeng fetched successfully",
      data: usahaKlengkengList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export default {
  addUsahaKlengkeng,
  updateUsahaKlengkeng,
  deleteUsahaKlengkeng,
  getUsahaKlengkengByKode,
  getAllUsahaKlengkeng,
};
