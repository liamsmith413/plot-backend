import { Request, Response } from 'express';
import Plot from '../models/Plot';

export const getPlots = async (req: Request, res: Response) => {
    try {
        const plots = await Plot.find();
        res.status(200).json(plots);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error fetching plot', error: errorMessage });
    }
};

export const getPlotById = async (req: Request, res: Response): Promise<any> => {
    try {
        const plot = await Plot.findById(req.params.id);
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }
        res.status(200).json(plot);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error fetching plot', error: errorMessage });
    }
};

export const createPlot = async (req: Request, res: Response): Promise<any> => {
    try {
        // Ensure the file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Set the image path in the body
        req.body.imagePath = req.file.filename;

        // Create and save the new plot
        const newPlot = new Plot(req.body);
        await newPlot.save();

        // Return the newly created plot
        res.status(201).json(newPlot);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error creating plot:', errorMessage); // Log the error
        res.status(500).json({ message: 'Error creating plot', error: errorMessage });
    }
};


export const updatePlot = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.file) {
            req.body.imagePath = req.file.filename;
        }
        const plot = await Plot.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }
        res.status(200).json(plot);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error updating plot', error: errorMessage });
    }
};

export const deletePlot = async (req: Request, res: Response): Promise<any> => {
    try {
        const plot = await Plot.findByIdAndDelete(req.params.id);
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }
        res.status(204).send();
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error updating plot', error: errorMessage });
    }
};
