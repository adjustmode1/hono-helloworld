// global types
type MandatoryS3Params = {
  Bucket: string;
  Key: string;
};

type BufferType = string | Buffer | Uint8Array;

type TranslateResponseType = {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage: string;
    }>;
  };
};
// global types
export interface RrcClientConfigInterface {
  name: string;
  transport: number;
  options: {
    url: string;
    package: Array<string>;
    protoPath: Array<string>;
  };
}
type ImageUploadPolicies = {
  bucket: string;
  original: {
    name: string;
    extension: string;
    maxSize: number;
    mimetypes: string[];
  };
  thumbnail: {
    name: string;
    extension: string;
    dimensions: {
      height: number;
      width: number;
    };
  };
};
