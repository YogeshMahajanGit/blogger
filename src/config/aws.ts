// aws.ts
import { S3 } from "@aws-sdk/client-s3";
import { config } from "./config";

const s3 = new S3({
    region: config.region!,
    credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
    },
});

export default s3;
