import { Request, Response } from "express";
import rtService from "../services/rtService";

export const getRts = async (req: Request, res: Response) => {
  try {
    const rts = await rtService.getAllRts();
    res.json({
      statusCode: 200,
      message: "Rts fetched successfully",
      data: rts,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getRtByKode = async (req: Request, res: Response) => {
  try {
    const rt = await rtService.getRtByKode(req.params.kode);
    if (!rt) {
      return res.status(404).json({
        statusCode: 404,
        message: "Rt not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Rt fetched successfully",
      data: rt,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const createRt = async (req: Request, res: Response) => {
  try {
    const newRt = await rtService.createRt(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Rt created successfully",
      data: newRt,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const updateRt = async (req: Request, res: Response) => {
  try {
    const updatedRt = await rtService.updateRt(req.params.kode, req.body);
    if (!updatedRt) {
      return res.status(404).json({
        statusCode: 404,
        message: "Rt not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Rt updated successfully",
      data: updatedRt,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const deleteRt = async (req: Request, res: Response) => {
  try {
    const deletedRt = await rtService.deleteRt(req.params.kode);
    if (!deletedRt) {
      return res.status(404).json({
        statusCode: 404,
        message: "Rt not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Rt deleted successfully",
      data: deletedRt,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getAllRtGeoJSON = async (req: Request, res: Response) => {
  try {
    const rtGeoJSONList = await rtService.getAllRtGeoJSON();
    res.status(200).json({
      statusCode: 200,
      message: "GeoJSON for all RT fetched successfully",
      data: rtGeoJSONList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getAllAgregateProperties = async (req: Request, res: Response) => {
  try {
    const aggregateProperties = await rtService.calculateTotals();
    res.status(200).json({
      statusCode: 200,
      message: "Aggregate properties fetched successfully",
      data: aggregateProperties,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export default {
  getRts,
  getRtByKode, // Perubahan di sini
  createRt,
  updateRt,
  deleteRt,
  getAllRtGeoJSON,
    getAllAgregateProperties,
};
