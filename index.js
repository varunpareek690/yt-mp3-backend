import express from "express";
import cors from "cors";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ytdlp from "yt-dlp-exec";

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(cors());

app.get("/convert", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("YouTube URL required");
  }

  const output = `audio-${Date.now()}.mp3`;

  try {
    await ytdlp(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: output,
      ffmpegLocation: ffmpegPath
    });

    res.download(output, () => {
      fs.unlinkSync(output);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
