import multer from "multer";
import path from "path";

export const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join("./public"));
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split(" ").join("-");
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    callback(null, baseName + "-" + Date.now() + extension);
  },
});

export const handle_multipart_data = multer({
  storage: Storage,
  limits: {
    fileSize: 1024 * 1024 * 4,
  },
  fileFilter: (req, file, callback) => {
    const FileTypes =
      /jpeg|JPEG|JPG|PNG|GIF|AVIF|jpg|png|gif|avif|MP4|mp4|MKV|mkv|WEBM|VID|webm|vid|AVI|avi/;
    const mimType = FileTypes.test(file.mimetype);
    const extname = FileTypes.test(path.extname(file.originalname));
    if (mimType && extname) {
      return callback(null, true);
    }
    return callback(new Error("File type not supported"), false);
  },
});
