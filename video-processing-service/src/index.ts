import express from "express";
import { convertVideo, downloadRawVideo, uploadProcessedVideo, deleteRawVideo, deleteProcessedVideo, setupDirectories } from "./storage";
import { upload } from "@google-cloud/storage/build/cjs/src/resumable-upload";

// Create local dirs for videos
setupDirectories();

const app = express();
app.use(express.json());

// Process a video file from Cloud Storage into 360p
app.post("/process-video", async (req, res): Promise<any> => {
    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received!');
        } 
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad request: missing filename.');
    }

    const inputFilename = data.name;
    const outputFilename = `processed-${inputFilename}`;

    // Download raw video from Cloud Storage
    await downloadRawVideo(inputFilename);

    // Process video to 360p
    try {
        await convertVideo(inputFilename, outputFilename)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFilename),
            deleteProcessedVideo(outputFilename)
        ]);
        return res.status(500).send('Processed video failed.')
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFilename);

    await Promise.all([
        deleteRawVideo(inputFilename),
        deleteProcessedVideo(outputFilename)
    ])
    return res.status(200).send('Processed video successfully.')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});