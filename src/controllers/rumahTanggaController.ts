import { Request, Response } from "express";
import rumahTanggaService from "../services/rumahTanggaService";
import Rt from "../models/rtModel";
import mongoose from "mongoose";

const addRumahTangga = async (req: Request, res: Response) => {
  try {
    const newRumahTangga = await rumahTanggaService.addRumahTangga(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "RumahTangga created successfully",
      data: newRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateRumahTangga = async (req: Request, res: Response) => {
  try {
    const updatedRumahTangga = await rumahTanggaService.updateRumahTangga(
      req.params.id,
      req.body
    );
    if (!updatedRumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga updated successfully",
      data: updatedRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteRumahTangga = async (req: Request, res: Response) => {
  try {
    const deletedRumahTangga = await rumahTanggaService.deleteRumahTangga(
      req.params.id
    );
    if (!deletedRumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga deleted successfully",
      data: deletedRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getRumahTanggaById = async (req: Request, res: Response) => {
  try {
    const rumahTangga = await rumahTanggaService.getRumahTanggaById(
      req.params.id
    );
    if (!rumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga fetched successfully",
      data: rumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllRumahTangga = async (req: Request, res: Response) => {
  try {
    const rumahTanggaList = await rumahTanggaService.getAllRumahTangga();
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga fetched successfully",
      data: rumahTanggaList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export default {
  addRumahTangga,
  updateRumahTangga,
  deleteRumahTangga,
  getRumahTanggaById,
  getAllRumahTangga,
};
