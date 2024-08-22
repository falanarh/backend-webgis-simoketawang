import { Request, Response } from "express";
import slsService from "../services/slsService";

export const getSls = async (req: Request, res: Response) => {
  try {
    const sls = await slsService.getAllSls();
    res.json({
      statusCode: 200,
      message: "Sls fetched successfully",
      data: sls,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getSlsByKode = async (req: Request, res: Response) => {
  try {
    const sls = await slsService.getSlsByKode(req.params.kode);
    if (!sls) {
      return res.status(404).json({
        statusCode: 404,
        message: "Sls not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Sls fetched successfully",
      data: sls,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const createSls = async (req: Request, res: Response) => {
  try {
    const newSls = await slsService.createSls(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Sls created successfully",
      data: newSls,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const updateSls = async (req: Request, res: Response) => {
  try {
    const updatedSls = await slsService.updateSls(req.params.kode, req.body);
    if (!updatedSls) {
      return res.status(404).json({
        statusCode: 404,
        message: "Sls not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Sls updated successfully",
      data: updatedSls,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const deleteSls = async (req: Request, res: Response) => {
  try {
    const deletedSls = await slsService.deleteSls(req.params.kode);
    if (!deletedSls) {
      return res.status(404).json({
        statusCode: 404,
        message: "Sls not found",
      });
    }
    res.json({
      statusCode: 200,
      message: "Sls deleted successfully",
      data: deletedSls,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getAllSlsGeoJSON = async (req: Request, res: Response) => {
  try {
    const slsGeoJSONList = await slsService.getAllSlsGeoJSON();
    res.json({
      statusCode: 200,
      message: "GeoJSON for all Sls fetched successfully",
      data: slsGeoJSONList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const getAllAgregateSlsProperties = async (
  req: Request,
  res: Response
) => {
  try {
    const aggregateProperties = await slsService.calculateTotals();
    res.json({
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
  getSls,
  getSlsByKode,
  createSls,
  updateSls,
  deleteSls,
  getAllSlsGeoJSON,
  getAllAgregateSlsProperties,
};
