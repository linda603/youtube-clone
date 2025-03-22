// Google Cloud file interations
// Local file interactions
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();
const rawVideoBucketName = "l603-yt-raw-videos";
const processedBucketName = "l603-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export function setUpDirectories() {

}

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") // 360p
        .on("end", () => {
            console.log("Video processing successfully.");
            resolve();
        })
        .on("error", (err) => {
            console.log(`Error: ${err.message}`);
            reject(err);
        })
        .save(`${localRawVideoPath}/${processedVideoName}`);
    })
}

export async function downloadRawVideo(fileName: string) {

}

export async function uploadProcessedVideo(fileName: string) {
    
}