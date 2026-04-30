const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// TEST
app.get("/", (req, res) => {
  res.send("PDF Tools Running ✅");
});

// 📉 COMPRESS PDF
app.post("/compress", upload.single("file"), (req, res) => {

  if (!req.file) return res.status(400).send("No file");

  const input = req.file.path;
  const output = "compressed.pdf";

  const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${output} ${input}`;

  exec(cmd, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Compression failed");
    }

    res.download(output, () => {
      fs.unlinkSync(input);
      fs.unlinkSync(output);
    });
  });
});

app.listen(3000, () => console.log("Server running"));
